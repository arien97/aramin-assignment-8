document.addEventListener("DOMContentLoaded", function() {
    const loadingMessage = document.getElementById('loading');
    loadingMessage.style.display = 'none';  // Ensure loading message is hidden initially
});

document.getElementById("experiment-form").addEventListener("submit", function(event) {
    event.preventDefault();  // Prevent form submission

    const start = parseFloat(document.getElementById("start").value);
    const end = parseFloat(document.getElementById("end").value);
    const stepNum = parseInt(document.getElementById("step_num").value);

    const loadingMessage = document.getElementById('loading');
    const datasetImg = document.getElementById('dataset-img');
    const parametersImg = document.getElementById('parameters-img');
    
    // Show loading message
    loadingMessage.style.display = 'block';

    // Validation checks
    if (isNaN(start)) {
        alert("Please enter a valid number for Shift Start.");
        loadingMessage.style.display = 'none';
        return;
    }

    if (isNaN(end)) {
        alert("Please enter a valid number for Shift End.");
        loadingMessage.style.display = 'none';
        return;
    }

    if (isNaN(stepNum) || stepNum <= 0) {
        alert("Please enter a positive integer for Number of Steps.");
        loadingMessage.style.display = 'none';
        return;
    }

    if (start >= end) {
        alert("Shift Start should be smaller than Shift End.");
        loadingMessage.style.display = 'none';
        return;
    }

    // If all validations pass, submit the form
    fetch("/run_experiment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ start: start, end: end, step_num: stepNum })
    })
    .then(response => response.json())
    .then(data => {
        // Show and set images if they exist
        const resultsDiv = document.getElementById("results");
        resultsDiv.style.display = "block";

        if (data.dataset_img) {
            datasetImg.src = `/${data.dataset_img}?${new Date().getTime()}`;
            datasetImg.style.display = "block";
        }

        if (data.parameters_img) {
            parametersImg.src = `/${data.parameters_img}?${new Date().getTime()}`;
            parametersImg.style.display = "block";
        }

        // Hide loading message
        loadingMessage.style.display = 'none';
    })
    .catch(error => {
        console.error("Error running experiment:", error);
        
        // Hide loading message
        loadingMessage.style.display = 'none';
        
        alert("An error occurred while running the experiment.");
    });
});