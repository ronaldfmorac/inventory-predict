<?php

namespace Models;

/**
 * A Data Transfer Object (DTO) representing a single sales record.
 * Using a constructor property promotion for a clean and modern class definition.
 */
class SalesData
{
    public string $producto;
    public string $fecha;
    public int $cantidad;

    public function __construct(string $producto, string $fecha, int $cantidad)
    {
        // Basic validation can be done here if needed
        $this->producto = trim($producto);
        $this->fecha = $fecha;
        $this->cantidad = $cantidad;
    }
}
