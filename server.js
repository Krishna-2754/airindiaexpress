const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// AUTH: Use your actual sandbox key here
const JUSPAY_AUTH = process.env.JUSPAY_AUTH || 'Basic [YOUR_BASE64_KEY]'; 

app.post('/create-session', async (req, res) => {
    try {
        const scenario = req.body;
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.get('host');
        
        // Define IFG/BSP specific metadata based on scenario
        const isInternational = scenario.label.toLowerCase().includes("int");
        const isModification = scenario.id.includes("mod");

        // Merchant View URL updated for AI Express
        const merchantViewUrl = `${protocol}://${host}/merchant-view?fromCity=Delhi&toCity=Mumbai&fromCode=DEL&toCode=BOM&date=2026-02-15&depTime=23:30&arrTime=01:55&duration=02h+25m&flightNo=IX+519&pax=1&baggageCheckin=15&baggageHand=7`;

        const payload = {
            "order_id": `AIX-IFG-${Date.now()}`,
            "amount": scenario.amount,
            "currency": scenario.currency,
            "customer_id": "IFG_DEMO_USER",
            "customer_email": "bsp-test@airindiaexpress.in",
            "customer_phone": "9999999999",
            "mobile_country_code": "91",
            "payment_page_client_id": "airindiademo",
            "action": "paymentPage",
            "return_url": `${protocol}://${host}/?status=success&scenario=${scenario.id}`,
            "merchant_view_url": merchantViewUrl,
            "metadata.JUSPAY:gateway_reference_id": "FLIGHT",
            "udf3": "RCTT",
            "udf4": "Arora",
            "udf10": "IFG_DEMO_V1",
            "metadata.NAVITAIRE:session_expiry_in_sec": "900",
            "disable_merchant_integrity_check": true,
            "options.get_client_auth_token": true,
            "payment_filter": {
                "options": [
                    { "enable": "true", "paymentMethodType": "CARD" },
                    { "enable": "true", "paymentMethodType": "UPI" },
                    {
                        "enable": "true",
                        "paymentMethodType": "MERCHANT_CONTAINER",
                        "paymentMethods": ["BSP", "HOLD_AND_PAY", "NAV_AGENT_WALLET"]
                    }
                ],
                "allowDefaultOptions": true
            },
            "merchant_transient_info": JSON.stringify({
                lob: "Flight",
                userPersona: "B2C",
                travelType: isInternational ? "International" : "Domestic",
                metadata: {
                    bookingDetails: {
                        bookingStatus: isModification ? "Modified" : "Pending",
                        currencyCode: scenario.currency
                    }
                }
            }),
            "metadata.webhook_url": "https://api-uat-skyplus.goindigo.in/postpayment/v1/payment/webhook",
            "metadata.expiryInMins": "15"
        };

        const response = await axios.post('https://sandbox.juspay.in/session', payload, {
            headers: { 
                'Authorization': JUSPAY_AUTH, 
                'Content-Type': 'application/json' 
            }
        });

        res.json({ url: response.data.payment_links.web });
    } catch (error) {
        console.error("❌ IFG SESSION ERROR:", error.response?.data || error.message);
        res.status(500).json({ error: "IFG Session Creation Failed" });
    }
});

app.get('/merchant-view', (req, res) => {
    // Basic placeholder for the merchant summary view
    res.send(`
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #E31837;">Booking Summary</h2>
            <p><strong>Flight:</strong> ${req.query.fromCode} to ${req.query.toCode}</p>
            <p><strong>Passenger:</strong> ${req.query.pax} Adult</p>
            <hr/>
            <p>Redirecting to secure IATA payment gateway...</p>
        </div>
    `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Air India Express IFG Demo running on port ${PORT}`));