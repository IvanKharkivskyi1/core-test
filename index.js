/**
 * Generates random data based on a given JSON Schema.
 * @param {Object} schema - The JSON Schema defining the structure and constraints of the data.
 * @returns {any} - Randomly generated data that conforms to the schema.
 * @throws {Error} - Throws an error if the provided schema is invalid.
 */
function generateDataFromSchema(schema) {
    if (!schema || typeof schema !== "object") {
        throw new Error("Invalid schema provided");
    }

    switch (schema.type) {
        case "integer":
            return getRandomInt(schema.minimum || 0, schema.maximum || 100);
        case "number":
            return getRandomFloat(schema.minimum || 0, schema.maximum || 100);
        case "string":
            if (schema.enum) {
                return schema.enum[Math.floor(Math.random() * schema.enum.length)];
            }
            return generateRandomString(schema.minLength || 3, schema.maxLength || 10);
        case "boolean":
            return Math.random() < 0.5;
        case "array":
            const length = getRandomInt(schema.minItems || 0, schema.maxItems || 5);
            if (schema.uniqueItems) {
                const uniqueItems = new Set();
                while (uniqueItems.size < length) {
                    uniqueItems.add(generateDataFromSchema(schema.items));
                }
                return Array.from(uniqueItems);
            }
            return Array.from({ length }, () => generateDataFromSchema(schema.items));
        case "object":
            const obj = {};
            const requiredProps = schema.required || [];
            Object.entries(schema.properties).forEach(([key, propSchema]) => {
                // Always include required properties
                if (requiredProps.includes(key)) {
                    obj[key] = generateDataFromSchema(propSchema);
                } else if (Math.random() < 0.5) {
                    // Randomly include optional properties with a 50% chance
                    obj[key] = generateDataFromSchema(propSchema);
                }
            });
            return obj;
        default:
            return null;
    }
}

/**
 * Generates a random integer between the specified min and max values.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} - A random integer between min and max.
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a random floating-point number between the specified min and max values.
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (exclusive).
 * @returns {number} - A random floating-point number between min and max.
 */
function getRandomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generates a random string of the specified length.
 * @param {number} minLength - The minimum length of the string.
 * @param {number} maxLength - The maximum length of the string.
 * @returns {string} - A random string with a length between minLength and maxLength.
 */
function generateRandomString(minLength, maxLength) {
    const length = getRandomInt(minLength, maxLength);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => characters.charAt(getRandomInt(0, characters.length - 1))).join('');
}

/**
 * Logs a result message to the console and a DOM element with id "output".
 * @param {string} message - The message to log.
 */
function logResult(message) {
    console.log(message);
    document.getElementById("output").textContent += message + "\n";
}

/**
 * Runs a series of tests to validate the random data generation based on the schema.
 */
function runRandomTests() {
    logResult("\nRunning Random-Based Tests:\n");

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

    const randomData = generateDataFromSchema(schema);

    const tests = [
        // Check if the generated id is an integer and within the specified range
        { name: "Check id is integer", result: Number.isInteger(randomData.id) },
        { name: "Check id is within range", result: randomData.id >= 1 && randomData.id <= 1000 },

        // Ensure the name is a string and its length falls within the specified constraints
        { name: "Check name is string", result: typeof randomData.name === "string" },
        { name: "Check name length", result: randomData.name.length >= 3 && randomData.name.length <= 10 },

        // Verify isActive is a boolean
        { name: "Check isActive is boolean", result: typeof randomData.isActive === "boolean" },

        // Check if age is an integer or undefined, and if defined, it is within the specified range
        { name: "Check age is integer or undefined", result: randomData.age === undefined || (Number.isInteger(randomData.age) && randomData.age >= 18 && randomData.age <= 99) },

        // Validate email is either a string or undefined
        { name: "Check email is string or undefined", result: randomData.email === undefined || typeof randomData.email === "string" },

        // Ensure preferences is an object or undefined
        { name: "Check preferences is object or undefined", result: randomData.preferences === undefined || typeof randomData.preferences === "object" },

        // Check if notifications in preferences is a boolean, if preferences exist
        { name: "Check notifications in preferences is boolean if preferences exist", result: randomData.preferences === undefined || typeof randomData.preferences.notifications === "boolean" },

        // Verify theme in preferences is a string or undefined, if preferences exist
        { name: "Check theme in preferences is string or undefined", result: randomData.preferences === undefined || randomData.preferences.theme === undefined || typeof randomData.preferences.theme === "string" }
    ];

    // Test for an array schema with minItems = 0 to ensure an empty array is possible
    const emptyArraySchema = {
        type: "array",
        items: { type: "integer" },
        minItems: 0,
        maxItems: 5
    };
    const emptyArray = generateDataFromSchema(emptyArraySchema);
    const emptyArrayTest = emptyArray.length >= 0 && emptyArray.length <= 5;

    // Additional test for unique items in arrays
    const arraySchema = {
        type: "array",
        items: { type: "integer", minimum: 1, maximum: 10 },
        minItems: 5,
        maxItems: 5,
        uniqueItems: true
    };
    const randomArray = generateDataFromSchema(arraySchema);
    const uniqueTest = new Set(randomArray).size === randomArray.length;

    tests.push(
        { name: "Check empty array with minItems = 0", result: emptyArrayTest },
        { name: "Check unique items in array", result: uniqueTest }
    );

    // Log each test result
    tests.forEach(test => {
        logResult(`${test.name}: ${test.result ? "PASS" : "FAIL"}`);
    });

    logResult(`\nRandom Generated Data:\n\n${JSON.stringify(randomData, null, 2)}`);
    logResult(`\nRandom Generated Array:\n\n${JSON.stringify(randomArray, null, 2)}`);
}

document.addEventListener("DOMContentLoaded", () => {
    runRandomTests();
});
