package com.mita.entitlement.controller;

import com.mita.common.dto.ApiResponse;
import com.mita.entitlement.dto.ActivateCodeRequest;
import com.mita.entitlement.dto.CourseEntitlementDto;
import com.mita.entitlement.service.ActivationCodeService;
import com.mita.user.entity.User;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/access-codes")
@RequiredArgsConstructor
@Tag(name = "Access Codes", description = "Kích hoạt mã truy cập khóa học")
public class ActivationCodeController {

    private final ActivationCodeService activationCodeService;

    @PostMapping("/activate")
    @Operation(summary = "Kích hoạt mã truy cập")
    public ResponseEntity<ApiResponse<CourseEntitlementDto>> activate(
            @RequestBody ActivateCodeRequest request,
            Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        CourseEntitlementDto result = activationCodeService.activateCode(request.getCode(), user.getId());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }
}
