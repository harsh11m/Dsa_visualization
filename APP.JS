
const structures = {
    stack: [],
    queue: [],
    linkedlist: []
};

let currentStructure = "stack";
let steps = [];
let currentStep = 0;

const titles = {
    stack: "Stack Visualization",
    queue: "Queue Visualization",
    linkedlist: "Linked List Visualization"
};

const descriptions = {
    stack: "Last In First Out (LIFO)",
    queue: "First In First Out (FIFO)",
    linkedlist: "Nodes connected using pointers"
};

const operations = {
    stack: [
        ["push", "Push"],
        ["pop", "Pop"],
        ["peek", "Peek"]
    ],
    queue: [
        ["enqueue", "Enqueue"],
        ["dequeue", "Dequeue"],
        ["peek", "Peek"]
    ],
    linkedlist: [
        ["insert", "Insert at End"],
        ["delete", "Delete by Value"],
        ["search", "Search"]
    ]
};

const $ = id => document.getElementById(id);

function selectStructure(name) {
    currentStructure = name;
    steps = [];
    currentStep = 0;

    document.querySelectorAll(".structure-btn").forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.structure === name
        );
    });

    $("structureTitle").textContent = titles[name];
    $("structureDescription").textContent = descriptions[name];

    $("operationButtons").innerHTML =
        operations[name].map(([operation, label]) =>
            `<button data-operation="${operation}">${label}</button>`
        ).join("");

    $("valueInput").placeholder =
        name === "stack" ? "Enter stack value" :
            name === "queue" ? "Enter queue value" :
                "Enter node value";

    $("phaseTitle").textContent = "Ready";
    $("explanation").textContent =
        "Select an operation to see how the data structure changes internally.";

    $("memoryView").textContent = "Waiting for operation...";
    $("visualization").innerHTML =
        '<p class="empty-message">Select an operation to begin.</p>';

    updateNavigation();
}

function runOperation(operation) {

    const rawValue = $("valueInput").value;
    const needsValue = ["push", "enqueue", "insert", "delete", "search"].includes(operation);

    let value = null;

    if (needsValue) {
        if (rawValue.trim() === "") {
            alert("Please enter a value first.");
            return;
        }

        value = Number(rawValue);

        if (!Number.isSafeInteger(value)) {
            alert("Please enter a valid whole number.");
            return;
        }
    }

    let result;

    if (currentStructure === "stack") {
        result = DSA.stackOps[operation](
            structures.stack, value
        );
    }

    if (currentStructure === "queue") {
        result = DSA.queueOps[operation](
            structures.queue, value
        );
    }

    if (currentStructure === "linkedlist") {
        result = DSA.linkedListOps[operation](
            structures.linkedlist, value
        );
    }

    if (result.error) {
        alert(result.error);
        return;
    }

    steps = result.steps;
    currentStep = 0;

    if (result.finalState) {
        structures[currentStructure] = result.finalState;
    }

    renderStep();
}

function renderVisual(step) {

    const data = step.state;
    let html = "";

    if (currentStructure === "stack") {

        html += `<div class="stack-container">`;

        data.forEach((value, index) => {
            let cls = "stack-item";

            if (index === step.active) {
                cls += " current";
            }

            html += `
                <div class="${cls}">
                    ${value}
                </div>
            `;
        });

        html += `</div>`;

        html += `
            <div class="front-rear">
                <span>TOP: ${data.length ? data[data.length - 1] : "NULL"
            }</span>
                <span>SIZE: ${data.length}</span>
            </div>
        `;
    }

    if (currentStructure === "queue") {

        html += `<div class="queue-container">`;

        data.forEach((value, index) => {
            let cls = "queue-item";

            if (index === step.active) {
                cls += " current";
            }

            html += `<div class="${cls}">${value}</div>`;
        });

        html += `</div>`;

        html += `
            <div class="front-rear">
                <span>FRONT: ${data.length ? data[0] : "NULL"
            }</span>
                <span>REAR: ${data.length ? data[data.length - 1] : "NULL"
            }</span>
            </div>
        `;
    }

    if (currentStructure === "linkedlist") {

        html += `<div class="linked-container">`;

        if (data.length === 0) {
            html += `<p class="empty-message">HEAD → NULL (Empty List)</p>`;
        }

        data.forEach((node, index) => {

            let cls = "node-box";

            if (index === step.active) {
                cls += " current";
            }

            html += `
                <div class="${cls}">
                    <strong>DATA: ${node.value}</strong>
                    <div class="node-address">${node.address}</div>
                    <div class="node-address">
                        NEXT: ${data[index + 1]
                    ? data[index + 1].address
                    : "NULL"
                }
                    </div>
                </div>
            `;

            if (index !== data.length - 1) {
                html += `<span class="arrow">→</span>`;
            }
        });

        html += `</div>`;

        html += `
            <div class="front-rear">
                <span>HEAD: ${data.length ? data[0].address : "NULL"
            }</span>
                <span>TAIL: ${data.length ? data[data.length - 1].address : "NULL"
            }</span>
            </div>
        `;
    }

    $("visualization").innerHTML = html;
}

function renderMemory(step) {

    let html = `<p>${step.memory}</p>`;

    if (currentStructure === "stack") {

        step.state.forEach((value, index) => {
            html += `
                <p>STACK[${index}] = ${value}</p>
            `;
        });

        html += `
            <p><strong>TOP = ${step.state.length - 1}</strong></p>
        `;
    }

    if (currentStructure === "queue") {

        step.state.forEach((value, index) => {
            html += `
                <p>QUEUE[${index}] = ${value}</p>
            `;
        });

        html += `
            <p>FRONT = ${step.state.length ? 0 : -1}</p>
            <p>REAR = ${step.state.length - 1}</p>
        `;
    }

    if (currentStructure === "linkedlist") {

        html += `<hr>`;

        step.state.forEach((node, index) => {

            const next = step.state[index + 1];

            html += `
                <p>Node ${index + 1}</p>
                <p>Address = ${node.address}</p>
                <p>Data = ${node.value}</p>
                <p>Next = ${next ? next.address : "NULL"}</p>
                <hr>
            `;
        });

        html += `
            <p><strong>HEAD = ${step.state.length ? step.state[0].address : "NULL"
            }</strong></p>
        `;
    }

    $("memoryView").innerHTML = html;
}

function renderStep() {

    if (steps.length === 0) return;

    const step = steps[currentStep];

    $("phaseTitle").textContent = step.title;
    $("explanation").textContent = step.description;

    $("stepNumber").textContent =
        `Step ${currentStep + 1} / ${steps.length}`;

    $("progressBar").style.width =
        `${((currentStep + 1) / steps.length) * 100}%`;

    renderVisual(step);
    renderMemory(step);

    updateNavigation();
}

function updateNavigation() {

    $("previousBtn").disabled =
        steps.length === 0 || currentStep === 0;

    $("nextBtn").disabled =
        steps.length === 0 || currentStep === steps.length - 1;
}

document.querySelectorAll(".structure-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        selectStructure(btn.dataset.structure);
    });
});

$("operationButtons").addEventListener("click", event => {

    const button = event.target.closest("[data-operation]");

    if (!button) return;

    runOperation(button.dataset.operation);
});

$("nextBtn").addEventListener("click", () => {

    if (currentStep < steps.length - 1) {
        currentStep++;
        renderStep();
    }
});

$("previousBtn").addEventListener("click", () => {

    if (currentStep > 0) {
        currentStep--;
        renderStep();
    }
});

$("resetBtn").addEventListener("click", () => {

    structures[currentStructure] = [];
    steps = [];
    currentStep = 0;

    $("phaseTitle").textContent = "Reset Completed";
    $("explanation").textContent =
        "All elements have been removed. Data structure is empty.";

    $("memoryView").textContent =
        "Memory is empty. No active elements.";

    $("visualization").innerHTML =
        '<p class="empty-message">Empty Data Structure</p>';

    $("progressBar").style.width = "0%";
    $("stepNumber").textContent = "Step 0 / 0";

    updateNavigation();
});

selectStructure("stack");
