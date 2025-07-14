const Config = ({ outputAll, setOutputAll, maxSteps, setMaxSteps }) => {
    const handleMaxStepsChange = e => {
        const value = e.target.value;

        if (value === '' || /^[0-9]*$/.test(value)) {
            setMaxSteps(value);
        }
    };

    // Terminate the current program
    const terminate = async () => {
        fetch('http://localhost:3000/terminate');
    }

    return (
        <div className="Config">
            <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    checked={outputAll}
                    onChange={
                        e => setOutputAll(e.target.checked)
                    }
                />
                <span>Output All</span>
            </label>

            <label className="flex items-center space-x-2">
                <span>Max Steps:</span>
                <input
                    value={maxSteps}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    type="text"
                    placeholder="e.g. 1000"
                    onChange={handleMaxStepsChange}
                    className="border rounded px-2 py-1 w-24"
                />
            </label>

            <button onClick={terminate}>
                Terminate
            </button>
        </div>
    );
};

export default Config;
