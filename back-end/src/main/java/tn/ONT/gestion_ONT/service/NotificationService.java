package tn.ONT.gestion_ONT.service;

import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import tn.ONT.gestion_ONT.entity.Notification;


@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final SimpMessagingTemplate messagingTemplate;

    public void sendNotification(String userId, Notification notification) {
        log.info("Sending WS notification to {} with payload {}", userId, notification);
        messagingTemplate.convertAndSendToUser(
                userId,
                "/notifications",
                notification
        );
    }
    
    public void sendNotificationToMultipleUsers(List<Long> userIds, Notification notification) {
        for (Long userId : userIds) {
            sendNotification(userId.toString(), notification);
        }
    }
}

