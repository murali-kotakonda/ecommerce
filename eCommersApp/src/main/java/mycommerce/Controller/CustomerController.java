package mycommerce.Controller;

import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import mycommerce.Model.User;
import mycommerce.ModelDTO.CustomerDTO;
import mycommerce.ModelDTO.UserDTO;
import mycommerce.Service.UserService;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/ecom/customers")
public class CustomerController {

    private final UserService userService;

    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<User> addUser(@Valid @RequestBody CustomerDTO user) {
        log.info("Registering new customer with email={}", user.getEmail());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User addedUser = userService.addUser(user);
        log.info("Customer registered with id={}", addedUser.getUserId());
        return ResponseEntity.ok(addedUser);
    }

    @PutMapping("/update-password/{customerId}")
    public ResponseEntity<User> updateUserPassword(@PathVariable("customerId") Integer customerId,
                                                  @Valid @RequestBody UserDTO userdto) {
        User updatedUser = userService.changePassword(customerId, userdto);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/deactivate/{customerid}")
    public ResponseEntity<String> deactivateUser(@PathVariable("customerid") Integer customerId) {
        log.info("Deactivating customer id={}", customerId);
        String message = userService.deactivateUser(customerId);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/{customerid}")
    public ResponseEntity<User> getUserDetails(@PathVariable("customerid") Integer customerId) {
        User user = userService.getUserDetails(customerId);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/get-all-customer")
    public ResponseEntity<List<User>> getAllUserDetails() {
        List<User> users = userService.getAllUserDetails();
        return ResponseEntity.ok(users);
    }

}
