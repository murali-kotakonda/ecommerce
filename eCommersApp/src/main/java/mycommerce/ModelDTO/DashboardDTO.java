package mycommerce.ModelDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Admin dashboard metrics. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private long productCount;
    private long userCount;
    private long orderCount;
    private double totalSales;
    // Inventory visibility
    private long totalStock;
    private long lowStockCount;
    private long outOfStockCount;
}
