const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Configuration
const JUSPAY_AUTH = process.env.JUSPAY_AUTH || 'Basic [YOUR_BASE64_KEY]'; 
const CLIENT_ID = "airindiademo";

// Mock Data for Merchant Transient Info (MTI)
const generateMTI = (scenario) => {
    return JSON.stringify({
        lob: "Flight",
        userPersona: "B2C",
        travelType: scenario.label.toLowerCase().includes("int") ? "International" : "Domestic",
        customerType: "REPEAT",
        metadata: {
            bookingDetails: {
                pnrType: scenario.label.includes("Roundtrip") ? "Roundtrip" : scenario.label.includes("Multicity") ? "Multicity" : "Oneway",
                bookingStatus: scenario.id.includes("mod") ? "Modified" : "Pending",
                currencyCode: scenario.currency || "USD"
            }
        }
    });
};

app.post('/create-session', async (req, res) => {
    try {
        const scenario = req.body;
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const host = req.get('host');
        
        // Dynamic Air India Express Merchant View URL
        const merchantViewUrl = `${protocol}://${host}/merchant-view?fromCity=Delhi&toCity=Mumbai&fromCode=DEL&toCode=BOM&date=2026-02-15&depTime=23:30&arrTime=01:55&duration=02h+25m&flightNo=IX+519&pax=1&baggageCheckin=15&baggageHand=7`;

        const payload = {
            "order_id": `AIX-IFG-${Date.now()}`,
            "amount": scenario.amount,
            "currency": scenario.currency,
            "customer_id": "Test123",
            "customer_email": "test@airindiaexpress.in",
            "customer_phone": "9999999999",
            "mobile_country_code": "91",
            "payment_page_client_id": CLIENT_ID,
            "action": "paymentPage",
            "return_url": `${protocol}://${host}/?status=success&scenario=${scenario.id}`,
            "merchant_view_url": merchantViewUrl,
            "metadata.JUSPAY:gateway_reference_id": "FLIGHT",
            "udf3": "RCTT",
            "udf4": "Arora",
            "udf10": "IFG_Portal_Demo",
            "metadata.NAVITAIRE:session_expiry_in_sec": "900",
            "disable_merchant_integrity_check": true,
            "options.get_client_auth_token": true,
            "payment_filter": {
                "options": [
                    { "enable": "true", "paymentMethodType": "CARD" },
                    { "enable": "true", "paymentMethodType": "NB" },
                    { "enable": "true", "paymentMethodType": "UPI" },
                    {
                        "enable": "true",
                        "paymentMethodType": "WALLET",
                        "paymentMethods": ["NAV_VOUCHERS", "IFG_CASH"]
                    },
                    {
                        "enable": "true",
                        "paymentMethodType": "MERCHANT_CONTAINER",
                        "paymentMethods": ["BSP", "HOLD_AND_PAY", "NAV_AGENT_WALLET"]
                    }
                ],
                "allowDefaultOptions": true
            },
            "merchant_transient_info": generateMTI(scenario),
            "metadata.webhook_url": "https://api-uat-skyplus.goindigo.in/postpayment/v1/payment/webhook",
            "metadata.expiryInMins": "9000"
        };

        const response = await axios.post('https://sandbox.juspay.in/session', payload, {
            headers: { 
                'Authorization': JUSPAY_AUTH, 
                'Content-Type': 'application/json' 
            }
        });

        res.json({ url: response.data.payment_links.web });
    } catch (error) {
        console.error("❌ ERROR:", error.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/merchant-view', (req, res) => {
    // You can use your existing merchant-view.html file here
    res.send("<h1>Air India Express Booking Summary</h1>"); 
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 AI Express IFG Demo running on port ${PORT}`));