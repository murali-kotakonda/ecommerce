package mycommerce.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mycommerce.ModelDTO.DashboardDTO;
import mycommerce.Repository.OrderRepository;
import mycommerce.Repository.ProductRepository;
import mycommerce.Repository.UserRepository;
import mycommerce.Response.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/ecom/admin")
@RequiredArgsConstructor
@Tag(name = "Admin Dashboard", description = "Aggregate metrics for the admin dashboard")
public class DashboardController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    private static final int LOW_STOCK_THRESHOLD = 10;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardDTO>> dashboard() {
        Double sales = orderRepository.getTotalSales();
        Long totalStock = productRepository.getTotalStock();
        DashboardDTO dto = new DashboardDTO(
                productRepository.count(),
                userRepository.count(),
                orderRepository.count(),
                sales != null ? sales : 0.0,
                totalStock != null ? totalStock : 0L,
                productRepository.countLowStock(LOW_STOCK_THRESHOLD),
                productRepository.countOutOfStock());
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }
}
