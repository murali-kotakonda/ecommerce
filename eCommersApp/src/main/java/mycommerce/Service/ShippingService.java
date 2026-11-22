package mycommerce.Service;

import mycommerce.Exception.ShippingException;
import mycommerce.Model.ShippingDetails;
import mycommerce.ModelDTO.ShippingDTO;

public interface ShippingService {
	
  public ShippingDetails setShippingDetails(Integer orderId,Integer shipperId,ShippingDetails shippingDetails) throws ShippingException;
  
  public ShippingDetails updateShippingAddress(Integer shippingId,ShippingDTO shippingDTO)throws ShippingException;
  
  public void deleteShippingDetails(Integer shippingId)throws ShippingException;
  
  
}
