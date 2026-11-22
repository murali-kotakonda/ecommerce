package mycommerce.ServiceImpl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import mycommerce.Enum.UserAccountStatus;
import mycommerce.Enum.UserRole;
import mycommerce.Exception.UserException;
import mycommerce.Model.User;
import mycommerce.ModelDTO.AdminDTO;
import mycommerce.ModelDTO.CustomerDTO;
import mycommerce.ModelDTO.UserDTO;
import mycommerce.Repository.UserRepository;
import mycommerce.Service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	public User getUserByEmailId(String emailId) throws UserException {
		return userRepository.findByEmail(emailId).orElseThrow(() -> new UserException("User not found"));

	}

	@Override
	public User addUser(CustomerDTO customer) throws UserException {
		if (customer == null)
			throw new UserException("customer Can not be Null");
		Optional<User> findByEmail = userRepository.findByEmail(customer.getEmail());
		if (findByEmail.isPresent()) {
			throw new UserException("Email already registered: " + customer.getEmail());
		}

		User newCustomer = new User();
		newCustomer.setEmail(customer.getEmail());
		newCustomer.setPassword(customer.getPassword());
		newCustomer.setFirstName(customer.getFirstName());
		newCustomer.setLastName(customer.getLastName());
		newCustomer.setPhoneNumber(customer.getPhoneNumber());
		newCustomer.setRole(UserRole.ROLE_USER);
		newCustomer.setRegisterTime(LocalDateTime.now());
		newCustomer.setUserAccountStatus(UserAccountStatus.ACTIVE);

		return userRepository.save(newCustomer);
	}

	@Override
	public User addUserAdmin(AdminDTO customer) throws UserException {
		if (customer == null)
			throw new UserException("admin Can not be Null");
		log.info("Creating admin user with email={}", customer.getEmail());
		Optional<User> findByEmail = userRepository.findByEmail(customer.getEmail());
		if (findByEmail.isPresent()) {
			log.warn("Admin registration rejected: email already exists {}", customer.getEmail());
			throw new UserException("Email already registered: " + customer.getEmail());
		}
		User newAdmin = new User();
		newAdmin.setEmail(customer.getEmail());
		newAdmin.setPassword(customer.getPassword());
		newAdmin.setFirstName(customer.getFirstName());
		newAdmin.setLastName(customer.getLastName());
		newAdmin.setPhoneNumber(customer.getPhoneNumber());
		newAdmin.setRole(UserRole.ROLE_ADMIN);
		newAdmin.setRegisterTime(LocalDateTime.now());
		newAdmin.setUserAccountStatus(UserAccountStatus.ACTIVE);

		return userRepository.save(newAdmin);
	}

	public User changePassword(Integer userId, UserDTO customer) throws UserException {
		User user = userRepository.findById(userId).orElseThrow(() -> new UserException("User not found"));
		if (customer.getNewPassword().length() >= 5 && customer.getNewPassword().length() <= 10) {
			user.updatePassword(customer.getNewPassword(), passwordEncoder);
			return userRepository.save(user);
		} else {
			throw new UserException("provide valid  password");
		}

	}

	
	@Override
	public String deactivateUser(Integer userId) throws UserException {
		User existingUser = userRepository.findById(userId).orElseThrow(() -> new UserException("User not found"));
		existingUser.setUserAccountStatus(UserAccountStatus.DEACTIVETE);
		userRepository.save(existingUser);
		return "Account deactivet Succesfully";
	}

	@Override
	public User getUserDetails(Integer userId) throws UserException {
		User existingUser = userRepository.findById(userId).orElseThrow(() -> new UserException("User not found"));
		return existingUser;
	}

	@Override
	public List<User> getAllUserDetails() throws UserException {

		List<User> existingAllUser = userRepository.findAll();
		if (existingAllUser.isEmpty()) {
			throw new UserException("User list is Empty");
		}
		return existingAllUser;
	}

	

}
