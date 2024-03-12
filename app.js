// app.js

///////////////////////         getMercadoPagoToken      //////////////////////////
const getMercadoPagoToken = async () => {
    try {
        const tokenResponse = await fetch('http://localhost:3000/token');
        if (!tokenResponse.ok) {
            throw new Error(`Error al obtener el token: ${tokenResponse.status} - ${tokenResponse.statusText}`);
        }
        const tokenData = await tokenResponse.json();
        return tokenData.mpAccessToken;
    } catch (error) {
        console.error('Error al obtener el token:', error);
        alert('Ocurrió un error al obtener el token de MercadoPago. Por favor, recarga la página.');
    }
};


///////////////////////   MERCADO PAGO  ////////////////////////

document.getElementById('checkout-btn').addEventListener('click', async () => {
    try {
        const mpAccessToken = await getMercadoPagoToken();
        const mp = new MercadoPago(mpAccessToken, { locale: 'es-CO' });

        const orderData = {
            title: document.querySelector(".name").innerText,
            quantity: 1,
            unit_price: 100,
            currency_id: 'COL',
        };
        console.log('Datos de la orden:', orderData);

        const response = await fetch('http://localhost:3000/preference', {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(orderData),
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status} - ${response.statusText}`);
        }

        const preference = await response.json();
        console.log('Preferencia de pago:', preference);
        createCheckoutButton(mp, preference.id);
    } catch (error) {
        console.error('Error al realizar la operación:', error);
        alert('Ocurrió un error al procesar la operación. Por favor, inténtalo de nuevo más tarde.');
    }
});


//////////////////////////    createCheckoutButton ///////////////////////////////////////
const createCheckoutButton = (mp, preferenceId) => {
    const bricksBuilder = mp.bricks();

    const renderComponent = async () => {
        try {
            if (window.checkoutButton) window.checkoutButton.unmount();
            await bricksBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                },
            });
        } catch (error) {
            console.error('Error al crear el botón de pago:', error);
            alert('Ocurrió un error al crear el botón de pago. Por favor, recarga la página.');
        }
    };
    renderComponent();
};




