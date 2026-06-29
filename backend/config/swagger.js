const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Sphere API",
      version: "1.0.0",
      description:
        "REST API documentation for the Sphere Microservices Platform.\n\n" +
        "Authentication Instructions:\n" +
        "1. Login using POST /api/auth/login.\n" +
        "2. Copy the JWT token.\n" +
        "3. Click the 'Authorize' button.\n" +
        "4. Enter: Bearer <your_token>\n" +
        "5. Click Authorize.",
      contact: {
        name: "Sphere Development Team",
        email: "team@sphere.local",
      },
      license: {
        name: "MIT",
      },
    },

    servers: [
      {
        url: "http://localhost:5000",
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "User Authentication APIs",
      },
      {
        name: "Users",
        description: "User Management APIs",
      },
      {
        name: "Categories",
        description: "Category Management APIs",
      },
      {
        name: "Services",
        description: "Service Management APIs",
      },
      {
        name: "Favorites",
        description: "Favorite Services APIs",
      },
      {
        name: "Usage History",
        description: "Usage History APIs",
      },
      {
        name: "Reviews",
        description: "Review & Rating APIs",
      },
      {
        name: "Dashboard",
        description: "Dashboard Statistics APIs",
      },
      {
        name: "Analytics",
        description: "Analytics APIs",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "66a3eb5677dca27cf1d7452f6",
            },
            name: {
              type: "string",
              example: "Kasun",
            },
            email: {
              type: "string",
              example: "kasun@gmail.com",
            },
            role: {
              type: "string",
              example: "admin",
            },
          },
        },

        Category: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
              example: "Student Tools",
            },
            description: {
              type: "string",
              example: "Tools for university students",
            },
            icon: {
              type: "string",
              example: "graduation-cap",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
          },
        },

        Service: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
              example: "GPA Calculator",
            },
            slug: {
              type: "string",
              example: "gpa-calculator",
            },
            description: {
              type: "string",
              example: "Calculate semester GPA",
            },
            category: {
              $ref: "#/components/schemas/Category",
            },
            averageRating: {
              type: "number",
              example: 4.8,
            },
            reviewCount: {
              type: "integer",
              example: 23,
            },
            isActive: {
              type: "boolean",
              example: true,
            },
          },
        },

        Review: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            rating: {
              type: "integer",
              example: 5,
            },
            comment: {
              type: "string",
              example: "Excellent service!",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            service: {
              $ref: "#/components/schemas/Service",
            },
          },
        },
      },

      responses: {
        Unauthorized: {
          description: "Authentication required.",

          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },

                  message: {
                    type: "string",
                    example: "Not authorized, token failed",
                  },
                },
              },
            },
          },
        },

        Forbidden: {
          description: "Access denied.",

          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },

                  message: {
                    type: "string",
                    example: "Access denied",
                  },
                },
              },
            },
          },
        },

        NotFound: {
          description: "Resource not found.",

          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },

                  message: {
                    type: "string",
                    example: "Resource not found",
                  },
                },
              },
            },
          },
        },

        ValidationError: {
          description: "Validation failed.",

          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },

                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: {
                          type: "string",
                          example: "field",
                        },

                        value: {
                          type: "string",
                          example: "",
                        },

                        msg: {
                          type: "string",
                          example: "Service name is required",
                        },

                        path: {
                          type: "string",
                          example: "name",
                        },

                        location: {
                          type: "string",
                          example: "body",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },

        DuplicateResource: {
          description: "Duplicate resource.",

          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },

                  message: {
                    type: "string",
                    example: "Already exists",
                  },
                },
              },
            },
          },
        },

        ServerError: {
          description: "Internal server error.",

          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },

                  message: {
                    type: "string",
                    example: "Internal Server Error",
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
