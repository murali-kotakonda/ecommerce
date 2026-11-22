package mycommerce.ServiceImpl;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import mycommerce.Enum.OrderStatus;
import mycommerce.Enum.PaymentStatus;
import mycommerce.Exception.OrdersException;
import mycommerce.Exception.UserException;
import mycommerce.Model.Cart;
import mycommerce.Model.CartItem;
import mycommerce.Model.OrderItem;
import mycommerce.Model.Orders;
import mycommerce.Model.Product;
import mycommerce.Model.User;
import mycommerce.ModelDTO.OrdersDTO;
import mycommerce.Repository.CartItemRepository;
import mycommerce.Repository.CartRepository;
import mycommerce.Repository.OrderItemRepository;
import mycommerce.Repository.OrderRepository;
import mycommerce.Repository.ProductRepository;
import mycommerce.Repository.UserRepository;
import mycommerce.Service.OrdersService;
import jakarta.transaction.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrdersServiceImpl implements OrdersService {

    private final OrderRepository orderRepository;

    private final UserRepository userRepository;

    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;

    private final CartRepository cartRepository;

    @Override
    @Transactional
    public OrdersDTO placeOrder(Integer userId) throws OrdersException {
        log.info("Placing order for user id={}", userId);
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User Not Found In Database"));

        Cart usercart = existingUser.getCart();
        // Checkout validation: cart must exist and not be empty.
        if (usercart == null || usercart.getCartItems() == null || usercart.getCartItems().isEmpty()
                || usercart.getTotalAmount() == null || usercart.getTotalAmount() == 0) {
            throw new OrdersException("Add item To the cart first.......");
        }
        Integer cartId = usercart.getCartId();

        // Stock validation BEFORE creating the order.
        for (CartItem item : usercart.getCartItems()) {
            Product product = item.getProduct();
            Integer stock = product.getStockQuantity();
            if (stock != null && item.getQuantity() > stock) {
                throw new OrdersException("Insufficient stock for '" + product.getName()
                        + "'. Available: " + stock + ", requested: " + item.getQuantity());
            }
        }

        Orders newOrder = new Orders();
        newOrder.setOrderDate(LocalDateTime.now());
        newOrder.setStatus(OrderStatus.CREATED);

        existingUser.getOrders().add(newOrder);
        newOrder.setUser(existingUser);
        userRepository.save(existingUser);
        orderRepository.save(newOrder);

        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : usercart.getCartItems()) {
            if (cartItem.getCart().getCartId().equals(cartId)) {
                Product product = cartItem.getProduct();
                double unitPrice = (product.getDiscountPrice() != null && product.getDiscountPrice() > 0)
                        ? product.getDiscountPrice()
                        : product.getPrice();

                OrderItem orderItem = new OrderItem();
                orderItem.setQuantity(cartItem.getQuantity());
                orderItem.setProduct(product);
                orderItem.setOrderId(newOrder.getOrderId());
                orderItem.setUnitPrice(unitPrice);
                orderItem.setLineTotal(unitPrice * cartItem.getQuantity());
                orderItems.add(orderItem);

                // Automatically reduce inventory after the order is placed.
                if (product.getStockQuantity() != null) {
                    product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
                    if (product.getStockQuantity() <= 0) {
                        product.setStockQuantity(0);
                        product.setAvailable(false);
                        product.setActive(Boolean.FALSE);
                    }
                    productRepository.save(product);
                }
            }
        }

        newOrder.setOrderItem(orderItems);
        newOrder.setSubTotal(usercart.getSubTotal() != null ? usercart.getSubTotal() : 0.0);
        newOrder.setTaxAmount(usercart.getTaxAmount() != null ? usercart.getTaxAmount() : 0.0);
        newOrder.setTotalAmount(usercart.getTotalAmount());
        orderRepository.save(newOrder);

        // Empty the cart after order placement.
        cartItemRepository.removeAllProductFromCart(cartId);
        if (usercart.getCartItems() != null) {
            usercart.getCartItems().clear();
        }
        usercart.setSubTotal(0.0);
        usercart.setTaxAmount(0.0);
        usercart.setTotalAmount(0.0);
        cartRepository.save(usercart);

        OrdersDTO orderdata = new OrdersDTO();
        orderdata.setOrderId(newOrder.getOrderId());
        orderdata.setOrderAmount(newOrder.getTotalAmount());
        orderdata.setStatus(newOrder.getStatus().name());
        orderdata.setPaymentStatus(PaymentStatus.PENDING.name());
        orderdata.setOrderDate(newOrder.getOrderDate().toString());
        log.info("Order id={} placed for user id={}, total={}", newOrder.getOrderId(), userId,
                newOrder.getTotalAmount());
        return orderdata;
    }

    @Transactional
    public Orders getOrdersDetails(Integer orderId) throws OrdersException {

        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new OrdersException("Order not found in the database."));
        return order;
    }

    @Override
    public List<Orders> getAllUserOrder(Integer userId) throws OrdersException {
        try {
            List<Orders> orders = orderRepository.getAllOrderByUserId(userId);
            if (orders.isEmpty()) {
                throw new OrdersException("No orders found for the user in the database.");
            }
            return orders;
        } catch (Exception e) {
            throw new OrdersException("Failed to fetch orders for the user: " + e.getMessage());
        }
    }

    @Override
    public List<Orders> viewAllOrders() throws OrdersException {

        List<Orders> orders = orderRepository.findAll();

        if (orders.isEmpty()) {
            throw new OrdersException("No orders found in the database.");
        }
        return orders;
    }

    @Override
    public List<Orders> viewAllOrderByDate(Date date) throws OrdersException {

        List<Orders> orders = orderRepository.findByOrderDateGreaterThanEqual(date);

        if (orders.isEmpty()) {
            throw new OrdersException("No orders found for the given date.");
        }

        return orders;

    }

    @Override
    public void deleteOrders(Integer userId, Integer Orderid) throws OrdersException {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User Not Found In Database"));
        Orders existingOrder = orderRepository.findById(Orderid)
                .orElseThrow(() -> new UserException("order Not Found In Database"));

        orderRepository.delete(existingOrder);
    }

    @Override
    public Orders updateOrders(Integer ordersid, OrdersDTO orderDTo) throws OrdersException {

        return null;
    }

}
