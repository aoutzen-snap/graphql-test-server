# graphql-test-server

## Overview

This project contains an example GraphQL server and schema that should serve as a useful tool for testing GraphQL tools. It can sometimes by difficult to find publicly available GraphQL APIs that allow for comprehensive testing of GraphQL concepts - this server and schema is intended to fill those gaps. Some of the concepts covered by this GraphQL schema currently include:

- Queries and mutations.
- Field return values of all scalar types and arrays.
- Fields returning complex types.
- Input values of all scalar types and arrays.
- Input values of complex types.
- Null and non-null return values and input values.
- Resolution and return of complex type values within other complex types.

This schema is intended to be expanded in the future to cover even more concepts, including but not limited to:

- Cursor-based pagination (including Apollo standard)
- Offset-based pagination
- Custom scalars
- Union types
- Interfaces

## Server Implementation

The GraphQL server is a Node server written in Javascript, designed to use as few helper libraries as possible, in order to get as close as possible to raw GraphQL.

No outside database connections exist in this server - instead, databases are mocked with in-memory objects and data. Currently there are "databases" for three core data types:
- Games
- Developers
- Platforms

 A small amount of starter data is loaded when the server is started. This can be queried and modified at will via the GraphQL schema, but be aware that resetting the server will also reset the data to its default, hard-coded state.

 In the future, the in-memory mock databases may be replaced by a solution that allows for more permanent data, such as bespoke data files or a lightweight database server solution.

## Usage

To use this server:

- Clone this repository to your local filesystem.
- Navigate to the top level of the repository and run `npm install`, and wait for all dependencies to finish installing.
- From the top level of the directory, run `npm start` to start the server.
  - The server root runs on http://localhost:4000 by default.
  - By default, the server will be run using [Nodemon](https://nodemon.io/) on [index.js](./index.js). While running via Nodemon, any changes to server source code will cause the server to restart automatically and immediately reflect your changes.
- Navigate to http://localhost:4000/graphql to test the server and schema using GraphiQL, or send GraphQL requests to http://localhost:4000/graphql with your preferred web API testing tool.