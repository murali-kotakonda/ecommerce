package mycommerce.Service;

import java.util.List;

import org.springframework.stereotype.Service;

import mycommerce.Exception.UserException;
import mycommerce.Model.User;
import mycommerce.ModelDTO.AdminDTO;
import mycommerce.ModelDTO.CustomerDTO;
import mycommerce.ModelDTO.UserDTO;


@Service
public interface UserService {
	
	
	
	public User getUserByEmailId(String emailId)throws UserException;

	public User addUser(CustomerDTO customer)  throws UserException;
	
	public User addUserAdmin(AdminDTO admin	)  throws UserException;

	public User changePassword(Integer userId, UserDTO customer)  throws UserException;

	public String deactivateUser(Integer userId) throws UserException;

	public User getUserDetails(Integer userId)throws UserException;

	public List<User> getAllUserDetails() throws UserException;
}
