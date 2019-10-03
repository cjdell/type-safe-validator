import { assertValid, ObjectParser, ParserReturn, StringParser } from '.';

const PersonSchema = ObjectParser({
  firstName: StringParser(),
  lastName: StringParser()
});

type Person = ParserReturn<typeof PersonSchema>;

// Below is inferred from the schema
// interface Person {
//   readonly firstName: string;
//   readonly lastName? string;
// }

const result: Person = assertValid(PersonSchema, {});

// tslint:disable-next-line:no-console
console.log(result.firstName, result.lastName.toUpperCase());
