package com.sychoi.backend.common.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class CustomException extends RuntimeException {

    private final HttpStatus status;
    private final String code;

    public CustomException(HttpStatus status, String code, String message) {
        super(message);
        this.status = status;
        this.code = code;
    }

    /** code를 별도로 지정하지 않으면 HTTP status name을 code로 사용한다. */
    public CustomException(HttpStatus status, String message) {
        super(message);
        this.status = status;
        this.code = status.name();
    }
}