const statusDiv = document.getElementById('status');
        const btn = document.getElementById('actionButton');

        // 1. Check if the user has been here before
        const hasVisited = localStorage.getItem('hasVisited');

        if (!hasVisited) {
            // First time logic
            statusDiv.innerText = "Welcome! Create an account.";
            btn.innerText = "Get Started";
            
            // Set the flag so next time they are "Returning"
            localStorage.setItem('hasVisited', 'true');
        } else {
            // Returning visitor logic
            statusDiv.innerText = "Welcome back, friend!";
            btn.innerText = "Continue Journey";
        }

        // // Optional: Reset button for testing purposes
        // btn.addEventListener('click', () => {
        //     alert("Button clicked! The script knows you've been here.");
        // });

        // import { LightSwitch } from "@theme-toggles/react";
        // import "@theme-toggles/react/styles/light-switch.css";

        // export default function App() {
        // return <LightSwitch />;
        // }

        const toggleBtn = document.getElementById('light-switch');
        
        toggleBtn.addEventListener('click', () => {
            // This class triggers the CSS animation from the stylesheet
            toggleBtn.classList.toggle('theme-toggle--toggled');
            
            // This handles your actual page theme
            document.body.classList.toggle('dark-mode');
        });