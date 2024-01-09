const express = require('express');
const axios = require('axios');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();
app.use(express.json());
require('dotenv').config(); 
const cors=require("cors");
app.use(cors());
const OPENAI_API_KEY = process.env.OPENAI_API_KE;


app.post('/', async (req, res) => {
    try {
        const {Actual_Code,query,Convert_to} = req.body;
        let q;
        if (query=="Generate_output"){
           q=`Generate me the output for the ${Actual_Code}`
        }else if(query=="debug"){
        q=`Here is my ${Actual_Code} please debug it, provide me the issue and updated code`

        }else if(query=="check_quelity"){
           q=`here is my ${Actual_Code} please check the quelity of it and share the quelity check from your side with percentages of different criteria and what i need to improve as well`
        }else if(query =="convert"){
        q=`here is my ${Actual_Code} please convert it to ${Convert_to} `
        }
        
        let response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: q }],
                max_tokens: 1000
            })
        });
  
        response = await response.json();
  
        // Check if response.choices is defined and not empty
        if (response.choices && response.choices.length > 0) {
            const data = response.choices[0].message.content;
            res.status(200).send({ code: data });
        } else {
            // Handle the case when response.choices is empty
            res.status(500).send({ msg: "No valid response from the API" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.message });
    }
  })

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
/////////////////////////////////


