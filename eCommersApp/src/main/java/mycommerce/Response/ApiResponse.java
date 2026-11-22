package mycommerce.Response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Standard response envelope for API endpoints so clients get a consistent
 * shape: {@code { success, message, data, timestamp }}.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {

	private boolean success;
	private String message;
	private T data;
	private LocalDateTime timestamp;

	public static <T> ApiResponse<T> ok(T data) {
		return new ApiResponse<>(true, "OK", data, LocalDateTime.now());
	}

	public static <T> ApiResponse<T> ok(String message, T data) {
		return new ApiResponse<>(true, message, data, LocalDateTime.now());
	}

	public static <T> ApiResponse<T> fail(String message) {
		return new ApiResponse<>(false, message, null, LocalDateTime.now());
	}
}
