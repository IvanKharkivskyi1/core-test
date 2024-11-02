# JSON-Schema-Based Random Data Generator

## Overview

This JavaScript function generates random data objects based on a given JSON Schema. It adheres to the constraints defined in the schema, such as data types, minimum/maximum values, required properties, and more. The implementation uses only core JavaScript and does not rely on any external libraries.

## Features

- Supports generating values for primitive types: `integer`, `number`, `string`, and `boolean`.
- Handles array generation with `minItems`, `maxItems`, and `uniqueItems` constraints.
- Recursively generates objects, respecting `required` fields and nested properties.
- Supports `enum` constraints for string values.

## Setup

1. Clone or download the project.
2. Open `index.html` in your browser to see the function in action.

## How It Works

- **Integer**: Generates a random integer between the specified `minimum` and `maximum` values.
- **Number**: Generates a random floating-point number between the specified `minimum` and `maximum` values.
- **String**: Generates a random string of length between `minLength` and `maxLength`. If `enum` is specified, a random value from the `enum` is chosen.
- **Boolean**: Randomly generates `true` or `false`.
- **Array**: Generates an array of random length between `minItems` and `maxItems`. If `uniqueItems` is set to `true`, ensures all items are unique.
- **Object**: Recursively generates objects, ensuring `required` properties are included.

## Parameters

- **schema**: A JSON Schema object that defines the structure and constraints of the data to be generated.
  - **type**: The type of the data to be generated (`integer`, `number`, `string`, `boolean`, `array`, or `object`).
  - **minimum / maximum**: Numeric constraints for integers and numbers.
  - **minLength / maxLength**: String length constraints.
  - **enum**: An array of possible values for string types.
  - **minItems / maxItems**: Length constraints for arrays.
  - **uniqueItems**: Boolean indicating if array items should be unique.
  - **required**: An array of property names that are required in an object.

## Edge Case Handling

- **Empty Arrays**: The generator can create empty arrays when `minItems` is set to 0.
- **Unique Items**: Arrays can be generated with unique items if `uniqueItems` is set to `true`.

## Usage

### Example JSON Schema

```javascript
const schema = {
    type: "object",
    properties: {
        id: { type: "integer", minimum: 1, maximum: 1000 },
        name: { type: "string", minLength: 3, maxLength: 10 },
        email: { type: "string", minLength: 5, maxLength: 20 },
        isActive: { type: "boolean" },
        age: { type: "integer", minimum: 18, maximum: 99 },
        preferences: {
            type: "object",
            properties: {
                notifications: { type: "boolean" },
                theme: { type: "string", minLength: 3, maxLength: 10 }
            }
        }
    },
    required: ["id", "name", "isActive"]
};
