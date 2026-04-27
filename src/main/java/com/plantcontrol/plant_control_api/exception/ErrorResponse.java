package com.plantcontrol.plant_control_api.exception;

import java.time.LocalDateTime;
import java.util.List;


public class ErrorResponse {
    
private int status;
private String message;
private String error;
private String path;
private LocalDateTime timestamp;
private List<String> validationErrors;

public ErrorResponse(){

}

public ErrorResponse(int status, String message, String error, String path, LocalDateTime timestamp) {
    this.status = status;
    this.message = message;
    this.error = error;
    this.path = path;
    this.timestamp = timestamp;
}

public ErrorResponse(int status, String message, String error, String path, LocalDateTime timestamp, List<String> validationErrors) {
    this.status = status;
    this.message = message;
    this.error = error;
    this.path = path;
    this.timestamp = timestamp;
    this.validationErrors = validationErrors;
}

public int getStatus() {
    return status;
}

public String getMessage() {
    return message;
}

public String getError() {
    return error;
}

public String getPath() {
    return path;
}

public LocalDateTime getTimestamp() {
    return timestamp;
}

public List<String> getValidationErrors() {
    return validationErrors;
}


}