package mycommerce.Service;

import java.util.List;

import mycommerce.Exception.ShipperException;
import mycommerce.Model.Shipper;

public interface ShipperService {

	public void deleteShipperById(Integer id) throws ShipperException;

	public Shipper saveShipper(Shipper shipper) throws ShipperException;

	public Shipper getShipperById(Integer id) throws ShipperException;

	public List<Shipper> getAllShippers() throws ShipperException;

}
