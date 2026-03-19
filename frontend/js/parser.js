/**
 * Parses a CSV file using PapaParse and returns the data as a Promise.
 * @param {File} file The CSV file to be parsed.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array of objects representing the CSV rows.
 */
function parseCSV(file) {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,       // Treat the first row as headers
            skipEmptyLines: true, // Ignore empty lines
            dynamicTyping: true, // Automatically convert numbers and booleans
            complete: (results) => {
                if (results.errors.length > 0) {
                    // It's often better to reject only on critical errors.
                    // PapaParse might report minor errors but still produce usable data.
                    console.error("Parsing errors:", results.errors);
                    // For this project, we can be strict.
                    reject(new Error(`CSV Parsing Error: ${results.errors[0].message}`));
                } else if (!results.data || results.data.length === 0) {
                    reject(new Error("CSV file is empty or could not be parsed."));
                }
                else {
                    // Required columns for basic operation
                    const requiredColumns = ['producto', 'fecha', 'cantidad'];
                    // Recommended columns for advanced analysis
                    const advancedColumns = ['categoria', 'stock_actual', 'stock_comprometido', 'costo', 'precio'];
                    
                    const firstRow = results.data[0];
                    const hasAllRequired = requiredColumns.every(col => col in firstRow);

                    if (!hasAllRequired) {
                        reject(new Error("csvError"));
                    } else {
                        // Normalize data and provide defaults for missing advanced columns
                        const normalizedData = results.data.map(row => {
                            return {
                                producto: row.producto,
                                fecha: row.fecha,
                                cantidad: Number(row.cantidad) || 0,
                                categoria: row.categoria || 'General',
                                stock_actual: Number(row.stock_actual) || 0,
                                stock_comprometido: Number(row.stock_comprometido) || 0,
                                costo: Number(row.costo) || 0,
                                precio: Number(row.precio) || 0
                            };
                        });
                        resolve(normalizedData);
                    }
                }
            },
            error: (error) => {
                reject(new Error(`A critical error occurred during parsing: ${error.message}`));
            }
        });
    });
}
