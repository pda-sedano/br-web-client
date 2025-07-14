import React, { useState, useEffect, useRef } from 'react';

const Terminal = ({ outputAll, maxSteps }) => {
    const [lines, setLines] = useState([]);         // array of terminal lines
    const [input, setInput] = useState('');         // current input
    const [promptChar, setPromptChar] = useState('>'); // prompt char, could change to "..." etc
    const terminalRef = useRef(null);               // for auto-scrolling

    // Auto scroll to bottom
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines]);

    const handleCommand = async () => {
        console.log(`handleCommand running: ${input}`);

        setLines(prev => [...prev, `${promptChar} ${input}`]);

        // Set loading prompt
        // setPromptChar('...');

        try {
            // If command is empty, use current program
            if (input !== '') {
                await fetch('http://localhost:3000/terminate');

                // Process raw input
                const response = await fetch('http://localhost:3000/raw', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(input),
                });

                const data = await response.json();
                console.log(data);

                if (response.status !== 200) {
                    setLines(prev => [...prev, `${data}`]);
                    return;
                }
            }
            
            // Run
            const url = `http://localhost:3000/run?output_all=${outputAll}${maxSteps === '' ? '' : `&max_steps=${maxSteps}`}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            const runData = await response.json();
            console.log(runData);

            // Assume server sends back an array of strings as lines
            const outputLines = runData || ['[no output]'];

            setLines(prev => [...prev, ...outputLines]);

        } catch (err) {
            setLines(prev => [...prev, '[error: could not reach server]']);
        }

        setPromptChar('>'); // Reset prompt
    };

    const handleSubmit = e => {
        e.preventDefault();

        handleCommand();
    };

    const handleInputChange = e => {
        let newInput = e.target.value;

        newInput = newInput.replace(/\\/g, 'λ');
        setInput(newInput);
    };

    return (
        <div
            ref={terminalRef}
            className="bg-black text-green-400 font-mono p-4 rounded h-96 overflow-y-auto"
        >
            {
                lines.map((line, idx) => (
                    <div key={idx}>{line}</div>
                ))
            }

            {/* Current input line */}
            <form onSubmit={handleSubmit} className="flex">
                <span className="mr-2">{promptChar}</span>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    className="bg-black text-green-400 outline-none border-none flex-1"
                    autoFocus
                />
            </form>
        </div>
    );
};

export default Terminal;
