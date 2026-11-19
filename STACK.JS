
window.DSA = window.DSA || {};

DSA.stackOps = {

    push(state, value) {
        const steps = [];
        let data = [...state];

        steps.push({
            title: "Phase 1: Before Push",
            description: `Current stack contains ${data.length} elements. TOP = ${data.length - 1}.`,
            state: [...data],
            active: -1,
            memory: `TOP = ${data.length - 1}`
        });

        steps.push({
            title: "Phase 2: Push Operation",
            description: `Element ${value} is inserted at the top of the stack.`,
            state: [...data, value],
            active: data.length,
            memory: `Writing ${value} at index ${data.length}.`
        });

        data.push(value);

        steps.push({
            title: "Phase 3: Update TOP",
            description: `TOP is incremented. New TOP = ${data.length - 1}.`,
            state: [...data],
            active: data.length - 1,
            memory: `TOP = TOP + 1 = ${data.length - 1}`
        });

        steps.push({
            title: "Phase 4: Push Completed",
            description: `Element ${value} is successfully stored in the stack.`,
            state: [...data],
            active: data.length - 1,
            memory: `STACK[${data.length - 1}] = ${value}`
        });

        return { steps, finalState: data };
    },

    pop(state) {
        const steps = [];
        let data = [...state];

        if (data.length === 0) {
            return { error: "Stack Underflow! Stack is empty." };
        }

        const removed = data[data.length - 1];

        steps.push({
            title: "Phase 1: Before Pop",
            description: `TOP points to index ${data.length - 1}, containing ${removed}.`,
            state: [...data],
            active: data.length - 1,
            memory: `TOP = ${data.length - 1}`
        });

        steps.push({
            title: "Phase 2: Remove TOP Element",
            description: `Element ${removed} is selected for removal.`,
            state: [...data],
            active: data.length - 1,
            memory: `POP removes STACK[${data.length - 1}]`
        });

        data.pop();

        steps.push({
            title: "Phase 3: Update TOP",
            description: `The element has been removed. TOP decreases by 1.`,
            state: [...data],
            active: data.length - 1,
            memory: `TOP = ${data.length - 1}`
        });

        steps.push({
            title: "Phase 4: Pop Completed",
            description: `${removed} has been removed successfully.`,
            state: [...data],
            active: -1,
            memory: `New stack size = ${data.length}`
        });

        return { steps, finalState: data };
    },

    peek(state) {
        if (state.length === 0) {
            return { error: "Stack is empty. Nothing to peek." };
        }

        const top = state.length - 1;
        const value = state[top];

        return {
            finalState: [...state],
            steps: [
                {
                    title: "Phase 1: Locate TOP",
                    description: `TOP points to index ${top}.`,
                    state: [...state],
                    active: top,
                    memory: `TOP = ${top}`
                },
                {
                    title: "Phase 2: Read TOP",
                    description: `The top element is ${value}. No element is removed.`,
                    state: [...state],
                    active: top,
                    memory: `STACK[${top}] = ${value}`
                },
                {
                    title: "Phase 3: Peek Completed",
                    description: `Peek returns ${value}. The stack remains unchanged.`,
                    state: [...state],
                    active: top,
                    memory: `TOP remains ${top}`
                }
            ]
        };
    }
};
