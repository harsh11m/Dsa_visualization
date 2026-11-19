
window.DSA = window.DSA || {};

DSA.queueOps = {

    enqueue(state, value) {
        let data = [...state];

        const steps = [
            {
                title: "Phase 1: Before Enqueue",
                description: `Current queue has ${data.length} elements.`,
                state: [...data],
                active: -1,
                memory: `FRONT = ${data.length ? 0 : -1}, REAR = ${data.length - 1}`
            },
            {
                title: "Phase 2: Locate REAR",
                description: "Find the rear position where the new element will be inserted.",
                state: [...data],
                active: data.length - 1,
                memory: `Next REAR index = ${data.length}`
            }
        ];

        data.push(value);

        steps.push({
            title: "Phase 3: Insert Element",
            description: `Element ${value} is inserted at the REAR of the queue.`,
            state: [...data],
            active: data.length - 1,
            memory: `QUEUE[${data.length - 1}] = ${value}`
        });

        steps.push({
            title: "Phase 4: Update REAR",
            description: `REAR now points to index ${data.length - 1}.`,
            state: [...data],
            active: data.length - 1,
            memory: `REAR = ${data.length - 1}`
        });

        return { steps, finalState: data };
    },

    dequeue(state) {
        let data = [...state];

        if (data.length === 0) {
            return { error: "Queue Underflow! Queue is empty." };
        }

        const removed = data[0];

        const steps = [
            {
                title: "Phase 1: Before Dequeue",
                description: `FRONT points to ${removed}.`,
                state: [...data],
                active: 0,
                memory: `FRONT = 0, REAR = ${data.length - 1}`
            },
            {
                title: "Phase 2: Remove FRONT",
                description: `Element ${removed} is selected for removal.`,
                state: [...data],
                active: 0,
                memory: `Removing QUEUE[0]`
            }
        ];

        data.shift();

        steps.push({
            title: "Phase 3: Shift Queue",
            description: `In this simple array-based queue, remaining elements shift one position left.`,
            state: [...data],
            active: data.length ? 0 : -1,
            memory: `New FRONT = ${data.length ? 0 : -1}`
        });

        steps.push({
            title: "Phase 4: Dequeue Completed",
            description: `${removed} has been removed from the queue.`,
            state: [...data],
            active: -1,
            memory: `New REAR = ${data.length - 1}`
        });

        return { steps, finalState: data };
    },

    peek(state) {
        if (state.length === 0) {
            return { error: "Queue is empty. Nothing to peek." };
        }

        const value = state[0];

        return {
            finalState: [...state],
            steps: [
                {
                    title: "Phase 1: Locate FRONT",
                    description: "FRONT points to the first element.",
                    state: [...state],
                    active: 0,
                    memory: "FRONT = 0"
                },
                {
                    title: "Phase 2: Read FRONT",
                    description: `The first element is ${value}.`,
                    state: [...state],
                    active: 0,
                    memory: `QUEUE[0] = ${value}`
                },
                {
                    title: "Phase 3: Peek Completed",
                    description: "The queue remains unchanged.",
                    state: [...state],
                    active: 0,
                    memory: `FRONT = 0, REAR = ${state.length - 1}`
                }
            ]
        };
    }
};
