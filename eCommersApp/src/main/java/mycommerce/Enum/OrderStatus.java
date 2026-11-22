package mycommerce.Enum;

public enum OrderStatus {
	// Spec lifecycle
	CREATED,
	CONFIRMED,
	SHIPPED,
	DELIVERED,
	CANCELLED,
	// Legacy values retained for backward compatibility
	PENDING,
	CANCELED
}
