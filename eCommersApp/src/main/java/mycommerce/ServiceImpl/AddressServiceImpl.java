package mycommerce.ServiceImpl;

import java.util.List;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import mycommerce.Exception.AddressException;
import mycommerce.Exception.UserException;
import mycommerce.Model.Address;
import mycommerce.Model.User;
import mycommerce.Repository.AddressRepository;
import mycommerce.Repository.UserRepository;
import mycommerce.Service.AddressService;

@Service
@Slf4j
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;


    @Override
    public Address addAddressToUser(Integer userId, Address address) throws AddressException {
        log.info("Adding address for user id={}", userId);
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found with id: " + userId));

        Address saveaAddress = addressRepository.save(address);
        saveaAddress.setUser(existingUser);

        existingUser.getAddress().add(saveaAddress);
        userRepository.save(existingUser);
        log.debug("Address id={} saved for user id={}", saveaAddress.getAddressID(), userId);
        return saveaAddress;
    }

    @Override
    public Address updateAddress(Address address,Integer addressId) throws AddressException {

        Address existingAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressException("Address not found"));


        existingAddress.setFlatNo(address.getFlatNo());
        existingAddress.setZipCode(address.getZipCode());
        existingAddress.setStreet(address.getStreet());
        existingAddress.setCity(address.getCity());
        existingAddress.setState(address.getState());
        // Save the updated address in the repository
        return addressRepository.save(existingAddress);
    }

    @Override
    public void removeAddress(Integer addressId) throws AddressException {
        // Find the existing address by ID
        Address existingAddress = addressRepository.findById(addressId)
                .orElseThrow(() -> new AddressException("Address not found"));

        // Delete the address from the repository
        addressRepository.delete(existingAddress);
    }

    @Override
    public List<Address> getAllUserAddress(Integer userId) throws AddressException {
        List<Address> userAddressList = addressRepository.getUserAddressList(userId);
        if (userAddressList.isEmpty()) {
            log.warn("No addresses found for user id={}", userId);
            throw new AddressException("User does not have any address");
        }
        return userAddressList;
    }


}
