//// File: com.example.ForumBackend.controller.FileController.java
//
//package com.example.ForumBackend.controller;
//
//import com.example.ForumBackend.service.FileStorageService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.Resource;
//import org.springframework.http.HttpHeaders;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.nio.file.Paths;
//
//@RestController
//@RequestMapping("/api/files")
//public class FileController {
//
//    @Autowired
//    private FileStorageService fileStorageService;
//
//    @GetMapping
//    public ResponseEntity<Resource> downloadFile(@RequestParam String path) {
//        try {
//            Resource file = fileStorageService.loadAsResource(path);
//            String filename = Paths.get(path).getFileName().toString();
//
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
//                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
//                    .body(file);
//        } catch (Exception e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
//}


// AWS file download
package com.example.ForumBackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectResponse;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private S3Client s3Client;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    /**
     * Example endpoint: GET /api/files?key=my-file.jpg
     * Streams file contents from S3 to the client.
     */
    @GetMapping
    public ResponseEntity<Resource> downloadFile(@RequestParam String key) {
        try {
            // 1) Retrieve object from S3
            GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            ResponseInputStream<GetObjectResponse> s3Object = s3Client.getObject(getObjectRequest);

            // 2) Wrap S3 stream in a Spring Resource
            Resource resource = new InputStreamResource(s3Object);

            // 3) Determine content type. If the object has a known content type, you can read it:
            String contentType = s3Object.response().contentType();
            if (contentType == null || contentType.isBlank()) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
            }

            // 4) Build headers.
            //    Use the "content-disposition" to suggest a filename to the browser.
            String contentDisposition = "attachment; filename=\"" + key + "\"";

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .body(resource);

        } catch (Exception e) {
            // If the file or bucket doesn't exist, etc.
            return ResponseEntity.notFound().build();
        }
    }
}

