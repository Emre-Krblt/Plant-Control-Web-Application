package com.plantcontrol.plant_control_api.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    @GetMapping({
            "/login",
            "/register",
            "/dashboard",
            "/plants",
            "/plants/new",
            "/plants/{plantId}",
            "/plants/{plantId}/edit",
            "/alerts",
            "/profile"
    })
    public String forwardToReactApp() {
        return "forward:/index.html";
    }
}
