package com.plantcontrol.plant_control_api.dto.auth;

public class UserProfileResponse {

    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Boolean active;

    public UserProfileResponse() {
    }

    public UserProfileResponse(
            Long id,
            String email,
            String firstName,
            String lastName,
            String role,
            Boolean active
    ) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getRole() {
        return role;
    }

    public Boolean getActive() {
        return active;
    }
}