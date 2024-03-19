import React from 'react';
import wifiError from '/src/styles/images/wifiError.png';

const NoInternetComponent: React.FC = () => {
    return (
        <div
            style={{
                textAlign: 'center',
                marginTop: '120px', // Adjusted marginTop value
                position: 'relative',
            }}
        >
            
            <h1
                style={{
                    fontSize: '4.5vw', // Responsive font size for heading
                    fontWeight: 'bold',
                    color: '#C41E3A',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)',
                    transform: 'translateY(-10px)',
                    zIndex: 2,
                    paddingTop: '35vh' // Adjusted paddingTop value
                }}
            >
                NO INTERNET CONNECTION
            </h1>

            <img
                src={wifiError}
                alt="No internet"
                style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    right: '0',
                    margin: 'auto',
                    zIndex: 1,
                    width: '80%',
                    maxWidth: '450px',
                    height: 'auto',
                }}
            />

            <p
                style={{
                    fontSize: '1.5vw', // Responsive font size for paragraphs
                    zIndex: 2,
                    paddingBottom: '1vh'
                }}
            >
                Your connection appears to be offline.
            </p>
            <p
                style={{
                    fontSize: '1.5vw', // Responsive font size for paragraphs
                    zIndex: 2,
                    paddingBottom: '20vh' // Adjusted paddingBottom value
                }}
            >
                Try to refresh the page.
            </p>
        </div>
    );
};

export default NoInternetComponent;