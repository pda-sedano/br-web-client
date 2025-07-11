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

 // Fake server request
    const handleCommand = async command => {
        setLines(prev => [...prev, `${promptChar} ${command}`]);

        // Set loading prompt
        // setPromptChar('...');

        try {
            // Process raw input
            let response = await fetch('http://localhost:3000/raw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(command),
            });

            const data = await response.json();
            console.log(data);

            // Run
            response = await fetch(`http://localhost:3000/run?output_all=${outputAll}&max_steps=${maxSteps}`, {
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

        handleCommand(e.target[0].value);
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
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-black text-green-400 outline-none border-none flex-1"
                    autoFocus
                />
            </form>
        </div>
    );
};

export default Terminal;
