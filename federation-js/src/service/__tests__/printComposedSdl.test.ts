import { fixtures } from 'apollo-federation-integration-testsuite';
import { parse, GraphQLError, visit, StringValueNode } from 'graphql';
import { composeAndValidate, compositionHasErrors } from '../../composition';

describe('printComposedSdl', () => {
  let composedSdl: string, errors: GraphQLError[];

  beforeAll(() => {
    // composeAndValidate calls `printComposedSdl` to return `composedSdl`
    const compositionResult = composeAndValidate(fixtures);
    if (compositionHasErrors(compositionResult)) {
      errors = compositionResult.errors;
    } else {
      composedSdl = compositionResult.composedSdl;
    }
  });

  it('composes without errors', () => {
    expect(errors).toBeUndefined();
  });

  it('produces a parseable output', () => {
    expect(() => parse(composedSdl!)).not.toThrow();
  });

  it('prints a fully composed schema correctly', () => {
    expect(composedSdl).toMatchInlineSnapshot(`
      "schema
        @using(spec: \\"https://lib.apollo.dev/join/v0.1\\")
        @using(spec: \\"https://lib.apollo.dev/local/v0.1\\")
      {
        query: Query
        mutation: Mutation
      }

      directive @using(
        spec: String!,
        prefix: String)
        repeatable on SCHEMA

      scalar join__FragmentId @specifiedBy(url: \\"https://lib.apollo.dev/join/v0.1/#join__fragmentid\\")
      scalar join__Url @specifiedBy(url: \\"https://lib.apollo.dev/join/v0.1/#join__url\\")
      input join__OutboundLinkHttp {
          url: join__Url!
      }
      input join__OutboundLink {
          http: join__OutboundLinkHttp
      }
      directive @join__key(
        graph: join__Graph!)
        repeatable on FRAGMENT_DEFINITION
      directive @join(
        graph: join__Graph!,
        type: String,
        requires: join__FragmentId,
        provides: join__FragmentId)
        on OBJECT | INTERFACE | UNION | FIELD_DEFINITION
      directive @join__error(
        graph: [join__Graph!]!,
        message: String)
        repeatable on OBJECT
        | INTERFACE
        | UNION
        | FIELD_DEFINITION
      directive @join__link(
        to: join__OutboundLink!)
        on ENUM_VALUE

      enum join__Graph {
        accounts @join__link(to: { http: { url: \\"https://accounts.api.com\\" } })
        books @join__link(to: { http: { url: \\"https://books.api.com\\" } })
        documents @join__link(to: { http: { url: \\"https://documents.api.com\\" } })
        inventory @join__link(to: { http: { url: \\"https://inventory.api.com\\" } })
        product @join__link(to: { http: { url: \\"https://product.api.com\\" } })
        reviews @join__link(to: { http: { url: \\"https://reviews.api.com\\" } })
      }


      directive @stream on FIELD

      directive @transform(from: String!) on FIELD

      union AccountType
        @join(graph: accounts, type: \\"PasswordAccount\\", requires: \\"local__id_0_AccountType_email\\")
        @join(graph: accounts, type: \\"SMSAccount\\", requires: \\"local__id_1_AccountType_number\\")
        @join(graph: accounts, type: \\"AccountType\\") = PasswordAccount | SMSAccount
      fragment local__id_0_AccountType_email on AccountType
      { email }
      fragment local__id_1_AccountType_number on AccountType
      { number }

      type Amazon 
        @join(graph: product, type: \\"Amazon\\") {
        referrer: String @join(graph: product)
      }



      union Body
        @join(graph: documents, type: \\"Body\\")
        @join(graph: documents, type: \\"Image\\")
        @join(graph: documents, type: \\"Text\\") = Image | Text


      type Book implements Product 
        @join(graph: books, type: \\"Book\\", requires: \\"local__id_4_Book_isbn\\")
        @join(graph: inventory, type: \\"Book\\", requires: \\"local__id_4_Book_isbn\\")
        @join(graph: product, type: \\"Book\\", requires: \\"local__id_4_Book_isbn\\")
        @join(graph: reviews, type: \\"Book\\", requires: \\"local__id_4_Book_isbn\\")
      {
        isbn: String! @join(graph: books)
        title: String @join(graph: books)
        year: Int @join(graph: books)
        similarBooks: [Book]! @join(graph: books)
        metadata: [MetadataOrError] @join(graph: books)
        inStock: Boolean @join(graph: inventory)
        isCheckedOut: Boolean @join(graph: inventory)
        upc: String! @join(graph: product)
        sku: String! @join(graph: product)
        name(delimeter: String = \\" \\"): String @join(graph: product, requires: \\"local__id_2_Book_title_year\\")
        price: String @join(graph: product)
        details: ProductDetailsBook @join(graph: product)
        reviews: [Review] @join(graph: reviews)
        relatedReviews: [Review!]! @join(graph: reviews, requires: \\"local__id_3_Book_similarBooks_isbn\\")
      }

      fragment local__id_2_Book_title_year on Book
      { title year }
      fragment local__id_3_Book_similarBooks_isbn on Book
      { similarBooks { isbn } }
      fragment local__id_4_Book_isbn on Book
      { isbn }

      union Brand
        @join(graph: product, type: \\"Ikea\\")
        @join(graph: product, type: \\"Amazon\\")
        @join(graph: product, type: \\"Brand\\") = Ikea | Amazon


      type Car implements Vehicle 
        @join(graph: product, type: \\"Car\\", requires: \\"local__id_6_Car_id\\")
        @join(graph: reviews, type: \\"Car\\", requires: \\"local__id_6_Car_id\\")
      {
        id: String! @join(graph: product)
        description: String @join(graph: product)
        price: String @join(graph: product)
        retailPrice: String @join(graph: reviews, requires: \\"local__id_5_Car_price\\")
      }

      fragment local__id_5_Car_price on Car
      { price }
      fragment local__id_6_Car_id on Car
      { id }

      type Error 
        @join(graph: books, type: \\"Error\\")
        @join(graph: product, type: \\"Error\\")
        @join(graph: reviews, type: \\"Error\\") {
        code: Int
        message: String
      }



      type Furniture implements Product 
        @join(graph: inventory, type: \\"Furniture\\", requires: \\"local__id_7_Furniture_sku\\")
        @join(graph: product, type: \\"Furniture\\", requires: \\"local__id_8_Furniture_upc\\")
        @join(graph: product, type: \\"Furniture\\", requires: \\"local__id_7_Furniture_sku\\")
        @join(graph: reviews, type: \\"Furniture\\", requires: \\"local__id_8_Furniture_upc\\")
      {
        upc: String! @join(graph: product)
        sku: String! @join(graph: product)
        name: String @join(graph: product)
        price: String @join(graph: product)
        brand: Brand @join(graph: product)
        metadata: [MetadataOrError] @join(graph: product)
        details: ProductDetailsFurniture @join(graph: product)
        inStock: Boolean @join(graph: inventory)
        isHeavy: Boolean @join(graph: inventory)
        reviews: [Review] @join(graph: reviews)
      }

      fragment local__id_7_Furniture_sku on Furniture
      { sku }
      fragment local__id_8_Furniture_upc on Furniture
      { upc }

      type Ikea 
        @join(graph: product, type: \\"Ikea\\") {
        asile: Int @join(graph: product)
      }



      type Image 
        @join(graph: documents, type: \\"Image\\") {
        name: String! @join(graph: documents)
        attributes: ImageAttributes! @join(graph: documents)
      }



      type ImageAttributes 
        @join(graph: documents, type: \\"ImageAttributes\\") {
        url: String! @join(graph: documents)
      }



      type KeyValue 
        @join(graph: books, type: \\"KeyValue\\")
        @join(graph: product, type: \\"KeyValue\\")
        @join(graph: reviews, type: \\"KeyValue\\") {
        key: String!
        value: String!
      }



      type Library 
        @join(graph: accounts, type: \\"Library\\", requires: \\"local__id_10_Library_id\\")
        @join(graph: books, type: \\"Library\\", requires: \\"local__id_10_Library_id\\")
      {
        id: ID! @join(graph: books)
        name: String @join(graph: books)
        userAccount(id: ID! = 1): User @join(graph: accounts, requires: \\"local__id_9_Library_name\\")
      }

      fragment local__id_9_Library_name on Library
      { name }
      fragment local__id_10_Library_id on Library
      { id }

      union MetadataOrError
        @join(graph: books, type: \\"MetadataOrError\\")
        @join(graph: books, type: \\"KeyValue\\")
        @join(graph: books, type: \\"Error\\")
        @join(graph: product, type: \\"MetadataOrError\\")
        @join(graph: product, type: \\"KeyValue\\")
        @join(graph: product, type: \\"Error\\")
        @join(graph: reviews, type: \\"MetadataOrError\\")
        @join(graph: reviews, type: \\"KeyValue\\")
        @join(graph: reviews, type: \\"Error\\") = KeyValue | Error


      type Mutation 
        @join(graph: accounts, type: \\"Mutation\\")
        @join(graph: reviews, type: \\"Mutation\\") {
        login(username: String!, password: String!): User @join(graph: accounts)
        reviewProduct(upc: String!, body: String!): Product @join(graph: reviews)
        updateReview(review: UpdateReviewInput!): Review @join(graph: reviews)
        deleteReview(id: ID!): Boolean @join(graph: reviews)
      }



      type Name 
        @join(graph: accounts, type: \\"Name\\") {
        first: String @join(graph: accounts)
        last: String @join(graph: accounts)
      }



      type PasswordAccount 
        @join(graph: accounts, type: \\"PasswordAccount\\", requires: \\"local__id_11_PasswordAccount_email\\")
      {
        email: String! @join(graph: accounts)
      }

      fragment local__id_11_PasswordAccount_email on PasswordAccount
      { email }

      interface Product 
        @join(graph: inventory, type: \\"Furniture\\", requires: \\"local__id_12_Product_sku\\")
        @join(graph: inventory, type: \\"Book\\", requires: \\"local__id_13_Product_isbn\\")
        @join(graph: product, type: \\"Product\\")
        @join(graph: product, type: \\"Furniture\\", requires: \\"local__id_14_Product_upc\\")
        @join(graph: product, type: \\"Furniture\\", requires: \\"local__id_12_Product_sku\\")
        @join(graph: product, type: \\"Book\\", requires: \\"local__id_13_Product_isbn\\")
        @join(graph: reviews, type: \\"Product\\")
        @join(graph: reviews, type: \\"Furniture\\", requires: \\"local__id_14_Product_upc\\")
        @join(graph: reviews, type: \\"Book\\", requires: \\"local__id_13_Product_isbn\\") {
        upc: String!
        sku: String!
        name: String
        price: String
        details: ProductDetails
        inStock: Boolean
        reviews: [Review]
      }
      fragment local__id_12_Product_sku on Product
      { sku }
      fragment local__id_13_Product_isbn on Product
      { isbn }
      fragment local__id_14_Product_upc on Product
      { upc }

      interface ProductDetails 
        @join(graph: product, type: \\"ProductDetailsFurniture\\")
        @join(graph: product, type: \\"ProductDetailsBook\\") {
        country: String
      }


      type ProductDetailsBook implements ProductDetails 
        @join(graph: product, type: \\"ProductDetailsBook\\") {
        country: String @join(graph: product)
        pages: Int @join(graph: product)
      }



      type ProductDetailsFurniture implements ProductDetails 
        @join(graph: product, type: \\"ProductDetailsFurniture\\") {
        country: String @join(graph: product)
        color: String @join(graph: product)
      }



      type Query 
        @join(graph: accounts, type: \\"Query\\")
        @join(graph: books, type: \\"Query\\")
        @join(graph: documents, type: \\"Query\\")
        @join(graph: product, type: \\"Query\\")
        @join(graph: reviews, type: \\"Query\\") {
        user(id: ID!): User @join(graph: accounts)
        me: User @join(graph: accounts)
        book(isbn: String!): Book @join(graph: books)
        books: [Book] @join(graph: books)
        library(id: ID!): Library @join(graph: books)
        body: Body! @join(graph: documents)
        product(upc: String!): Product @join(graph: product)
        vehicle(id: String!): Vehicle @join(graph: product)
        topProducts(first: Int = 5): [Product] @join(graph: product)
        topCars(first: Int = 5): [Car] @join(graph: product)
        topReviews(first: Int = 5): [Review] @join(graph: reviews)
      }



      type Review 
        @join(graph: reviews, type: \\"Review\\", requires: \\"local__id_16_Review_id\\")
      {
        id: ID! @join(graph: reviews)
        body(format: Boolean = false): String @join(graph: reviews)
        author: User @join(graph: reviews, provides: \\"local__id_15_Review_username\\")
        product: Product @join(graph: reviews)
        metadata: [MetadataOrError] @join(graph: reviews)
      }

      fragment local__id_15_Review_username on Review
      { username }
      fragment local__id_16_Review_id on Review
      { id }

      type SMSAccount 
        @join(graph: accounts, type: \\"SMSAccount\\", requires: \\"local__id_17_SMSAccount_number\\")
      {
        number: String @join(graph: accounts)
      }

      fragment local__id_17_SMSAccount_number on SMSAccount
      { number }

      type Text 
        @join(graph: documents, type: \\"Text\\") {
        name: String! @join(graph: documents)
        attributes: TextAttributes! @join(graph: documents)
      }



      type TextAttributes 
        @join(graph: documents, type: \\"TextAttributes\\") {
        bold: Boolean @join(graph: documents)
        text: String @join(graph: documents)
      }



      union Thing
        @join(graph: product, type: \\"Car\\", requires: \\"local__id_18_Thing_id\\")
        @join(graph: product, type: \\"Ikea\\")
        @join(graph: product, type: \\"Thing\\") = Car | Ikea
      fragment local__id_18_Thing_id on Thing
      { id }

      input UpdateReviewInput {
        id: ID!
        body: String
      }


      type User 
        @join(graph: accounts, type: \\"User\\", requires: \\"local__id_21_User_id\\")
        @join(graph: accounts, type: \\"User\\", requires: \\"local__id_22_User_username_name_first_last\\")
        @join(graph: inventory, type: \\"User\\", requires: \\"local__id_21_User_id\\")
        @join(graph: product, type: \\"User\\", requires: \\"local__id_21_User_id\\")
        @join(graph: reviews, type: \\"User\\", requires: \\"local__id_21_User_id\\")
      {
        id: ID! @join(graph: accounts)
        name: Name @join(graph: accounts)
        username: String @join(graph: accounts)
        birthDate(locale: String): String @join(graph: accounts)
        account: AccountType @join(graph: accounts)
        metadata: [UserMetadata] @join(graph: accounts)
        goodDescription: Boolean @join(graph: inventory, requires: \\"local__id_19_User_metadata_description\\")
        vehicle: Vehicle @join(graph: product)
        thing: Thing @join(graph: product)
        reviews: [Review] @join(graph: reviews)
        numberOfReviews: Int! @join(graph: reviews)
        goodAddress: Boolean @join(graph: reviews, requires: \\"local__id_20_User_metadata_address\\")
      }

      fragment local__id_19_User_metadata_description on User
      { metadata { description } }
      fragment local__id_20_User_metadata_address on User
      { metadata { address } }
      fragment local__id_21_User_id on User
      { id }
      fragment local__id_22_User_username_name_first_last on User
      { username name { first last } }

      type UserMetadata 
        @join(graph: accounts, type: \\"UserMetadata\\")
        @join(graph: inventory, type: \\"UserMetadata\\")
        @join(graph: reviews, type: \\"UserMetadata\\") {
        name: String @join(graph: accounts)
        address: String @join(graph: accounts)
        description: String @join(graph: accounts)
      }



      type Van implements Vehicle 
        @join(graph: product, type: \\"Van\\", requires: \\"local__id_24_Van_id\\")
        @join(graph: reviews, type: \\"Van\\", requires: \\"local__id_24_Van_id\\")
      {
        id: String! @join(graph: product)
        description: String @join(graph: product)
        price: String @join(graph: product)
        retailPrice: String @join(graph: reviews, requires: \\"local__id_23_Van_price\\")
      }

      fragment local__id_23_Van_price on Van
      { price }
      fragment local__id_24_Van_id on Van
      { id }

      interface Vehicle 
        @join(graph: product, type: \\"Vehicle\\")
        @join(graph: product, type: \\"Car\\", requires: \\"local__id_25_Vehicle_id\\")
        @join(graph: product, type: \\"Van\\", requires: \\"local__id_25_Vehicle_id\\")
        @join(graph: reviews, type: \\"Car\\", requires: \\"local__id_25_Vehicle_id\\")
        @join(graph: reviews, type: \\"Van\\", requires: \\"local__id_25_Vehicle_id\\") {
        id: String!
        description: String
        price: String
        retailPrice: String
      }
      fragment local__id_25_Vehicle_id on Vehicle
      { id }
      "
    `);
  });

  it('fieldsets are parseable', () => {
    const parsedCsdl = parse(composedSdl!);
    const fieldSets: string[] = [];

    // Collect all args with the 'fields' name (from @key, @provides, @requires directives)
    visit(parsedCsdl, {
      Argument(node) {
        if (node.name.value === 'fields') {
          fieldSets.push((node.value as StringValueNode).value);
        }
      },
    });

    // Ensure each found 'fields' arg is graphql parseable
    fieldSets.forEach((unparsed) => {
      expect(() => parse(unparsed)).not.toThrow();
    });
  });
});
