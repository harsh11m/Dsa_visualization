
const DSA = window.DSA || (window.DSA = {});

DSA.linkedListOps = {

    // Generate unique simulated memory addresses
    nextAddress(state) {
        const addresses = state.map(node =>
            parseInt(node.address, 16)
        );

        const highest = addresses.length
            ? Math.max(...addresses)
            : 0xF0;

        return "0x" + (highest + 16)
            .toString(16)
            .toUpperCase();
    },

    // INSERT a new node at the end
    insert(state, value) {
        const newState = state.map(node => ({ ...node }));
        const address = this.nextAddress(newState);

        const steps = [];

        steps.push({
            title: "Step 1: Create a new node",
            description: `A new node with value ${value} is created.`,
            state: newState.map(node => ({ ...node })),
            memory: `New node allocated at ${address}`,
            pointer: "No pointer changes yet."
        });

        const newNode = {
            value: value,
            address: address,
            next: null
        };

        steps.push({
            title: "Step 2: Allocate memory",
            description: `Memory is allocated for the new node at ${address}.`,
            state: [...newState.map(node => ({ ...node })), { ...newNode }],
            memory: `Address: ${address} | Data: ${value} | Next: NULL`,
            pointer: "The new node's NEXT pointer is NULL."
        });

        if (newState.length === 0) {
            newState.push(newNode);

            steps.push({
                title: "Step 3: Update HEAD",
                description: "The list is empty, so HEAD now points to the new node.",
                state: newState.map(node => ({ ...node })),
                memory: `HEAD → ${address}`,
                pointer: `HEAD points to ${address}.`
            });
        } else {
            const lastNode = newState[newState.length - 1];

            steps.push({
                title: "Step 3: Traverse the list",
                description: "Move through the nodes until the last node is found.",
                state: newState.map(node => ({ ...node })),
                memory: `Last node found at ${lastNode.address}`,
                pointer: `Current pointer is at ${lastNode.address}.`
            });

            lastNode.next = address;

            steps.push({
                title: "Step 4: Update NEXT pointer",
                description: `The last node now points to the new node at ${address}.`,
                state: [...newState.map(node => ({ ...node })), { ...newNode }],
                memory: `${lastNode.address}.NEXT → ${address}`,
                pointer: "The previous last node is connected to the new node."
            });

            newState.push(newNode);
        }

        steps.push({
            title: "Final Step: Insertion completed",
            description: `Node ${value} has been successfully inserted.`,
            state: newState.map(node => ({ ...node })),
            memory: `Total nodes: ${newState.length}`,
            pointer: "The last node's NEXT pointer is NULL."
        });

        return {
            finalState: newState,
            steps: steps
        };
    },

    // DELETE a node by value
    delete(state, value) {
        const newState = state.map(node => ({ ...node }));
        const steps = [];

        steps.push({
            title: "Step 1: Start searching",
            description: `Search for the node containing value ${value}.`,
            state: newState.map(node => ({ ...node })),
            memory: "No memory has been released yet.",
            pointer: "Start from HEAD."
        });

        const index = newState.findIndex(
            node => node.value == value
        );

        if (index === -1) {
            steps.push({
                title: "Node not found",
                description: `Value ${value} does not exist in the linked list.`,
                state: newState.map(node => ({ ...node })),
                memory: "No memory changes.",
                pointer: "All pointers remain unchanged."
            });

            return {
                finalState: newState,
                steps: steps
            };
        }

        const deletedNode = newState[index];

        steps.push({
            title: "Step 2: Node found",
            description: `Node containing ${value} is found at ${deletedNode.address}.`,
            state: newState.map(node => ({ ...node })),
            memory: `Target address: ${deletedNode.address}`,
            pointer: `Target node is at index ${index}.`
        });

        if (index === 0) {
            steps.push({
                title: "Step 3: Update HEAD",
                description: "HEAD is moved to the next node.",
                state: newState.slice(1).map(node => ({ ...node })),
                memory: `Old HEAD: ${deletedNode.address}`,
                pointer: "HEAD now points to the second node."
            });
        } else {
            const previousNode = newState[index - 1];
            const nextNode = newState[index + 1];

            previousNode.next = nextNode
                ? nextNode.address
                : null;

            steps.push({
                title: "Step 3: Update pointer",
                description: "The previous node is connected to the next node.",
                state: newState.filter((_, i) => i !== index)
                    .map(node => ({ ...node })),
                memory: `${previousNode.address}.NEXT → ${nextNode ? nextNode.address : "NULL"
                    }`,
                pointer: "The deleted node is bypassed."
            });
        }

        newState.splice(index, 1);

        // Reconnect all remaining nodes
        newState.forEach((node, i) => {
            node.next = newState[i + 1]
                ? newState[i + 1].address
                : null;
        });

        steps.push({
            title: "Final Step: Deletion completed",
            description: `Node ${value} has been deleted successfully.`,
            state: newState.map(node => ({ ...node })),
            memory: `Memory at ${deletedNode.address} is released in this simulation.`,
            pointer: "All remaining pointers are updated correctly."
        });

        return {
            finalState: newState,
            steps: steps
        };
    },

    // SEARCH for a value
    search(state, value) {
        const steps = [];
        let found = false;

        steps.push({
            title: "Step 1: Start from HEAD",
            description: `Begin searching for value ${value}.`,
            state: state.map(node => ({ ...node })),
            memory: "No memory changes.",
            pointer: "Current pointer = HEAD."
        });

        for (let i = 0; i < state.length; i++) {
            const currentNode = state[i];

            steps.push({
                title: `Step ${i + 2}: Visit node`,
                description: `Checking node with value ${currentNode.value}.`,
                state: state.map(node => ({ ...node })),
                memory: `Current address: ${currentNode.address}`,
                pointer: `Current pointer → ${currentNode.address}`
            });

            if (currentNode.value == value) {
                found = true;

                steps.push({
                    title: "Value found!",
                    description: `Value ${value} is found at position ${i + 1}.`,
                    state: state.map(node => ({ ...node })),
                    memory: `Found at address ${currentNode.address}`,
                    pointer: "Search successful."
                });

                break;
            }
        }

        if (!found) {
            steps.push({
                title: "Value not found",
                description: `Value ${value} is not present in the linked list.`,
                state: state.map(node => ({ ...node })),
                memory: "No memory changes.",
                pointer: "Reached NULL. Search unsuccessful."
            });
        }

        return {
            finalState: state.map(node => ({ ...node })),
            steps: steps
        };
    }

};
