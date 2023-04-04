import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import jsonData from "../../package.json" assert { type: "json" };
import { developmentLogger, productionLogger } from "./logger.js";
import { environment } from "../../config/index.js";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FILMHOUSE BOOKINGS",
      version: jsonData.version,
    },
    components: {
      securitySchemas: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["../../index.js"],
};

const swaggerSpecs = swaggerJSDoc(options);

/**
 *
 * @param {express app} app
 * @param {number} port
 */
export function swaggerDocs(app, port) {
  try {
    // Swagger page
    app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
    //Docs in JSON format
    app.get("docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpecs);
        if (environment === "Development") {
          console.log("Logging")
          developmentLogger.log(
            "info",
            `Documentation is available at http://localhost:${port}/docs`
          );
        } else {
          productionLogger.log("info",  `An error occurred ${JSON.stringify(error)}`)
        }
      });
   
  } catch (error) {
    if(environment === "Developement") {
        developmentLogger.log("error",  `An error occurred ${JSON.stringify(error)}`)
    } else {
        productionLogger.log("error",  `An error occurred ${JSON.stringify(error)}`)
    }
  }
}
