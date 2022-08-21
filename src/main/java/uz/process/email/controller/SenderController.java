package uz.process.email.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import uz.process.email.payload.MailPayload;
import uz.process.email.service.EmailService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mail")
public class SenderController {

    private final EmailService service;

    @GetMapping("send/{text}")
    public String sendEmail(@PathVariable String text) {
        return service.sendSimpleMessage("abdulhay.uralov@yahoo.com", "sending with java, method get", text);
    }

    @PostMapping("/send")
    public String sendToGmail(@RequestBody MailPayload payload) {
        System.out.println(payload);
        return service.sendSimpleMessage(payload.getGmail(), "sending with java", payload.getText());
    }
}
