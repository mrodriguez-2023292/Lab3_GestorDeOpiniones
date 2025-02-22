import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options ={
    swaggerDefinition:{
        openapi:"3.0.0",
        info:{
            title: "Opinions System API",
            version: "1.0.0",
            description: "API para un sistema de gestión de opiniones",
            contact:{
                name: "Mario Rodriguez",
                email: "mrodriguez-2023292@kinal.org.gt"
            }
        },
        servers:[
            {
                url: "http://127.0.0.1:3000/GODB-2023292/v1"
            }
        ]
    },
    apis:[
        "./src/auth/*.js",
        "./src/user/*.js",
        "./src/publication/*.js"
    ]
}

const swaggerDocs = swaggerJSDoc(options)

export { swaggerDocs, swaggerUi }