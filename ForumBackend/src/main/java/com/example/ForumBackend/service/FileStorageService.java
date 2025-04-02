//package com.example.ForumBackend.service;
//
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.*;
//import org.springframework.util.StringUtils;
//import org.springframework.beans.factory.annotation.Value;
//
//import org.springframework.core.io.Resource;
//import org.springframework.core.io.UrlResource;
//
//import java.net.MalformedURLException;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//
//
//
//@Service
//public class FileStorageService {
//
//    private final Path fileStorageLocation;
//
//    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
//        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
//        try {
//            Files.createDirectories(this.fileStorageLocation);
//        } catch (IOException ex) {
//            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
//        }
//    }
//
//    public Resource loadAsResource(String path) throws MalformedURLException {
//        Path file = fileStorageLocation.resolve(path).normalize(); // instead of hardcoded "uploads"
//        Resource resource = new UrlResource(file.toUri());
//
//        if (resource.exists() || resource.isReadable()) {
//            return resource;
//        } else {
//            throw new RuntimeException("Could not read file: " + path);
//        }
//    }
//
//
//
//    public String upload(MultipartFile file) {
//        String rawFilename = file.getOriginalFilename();
//        if (rawFilename == null) {
//            throw new RuntimeException("Uploaded file has no name!");
//        }
//        String cleanFilename = StringUtils.cleanPath(rawFilename);
//        String finalFilename = Paths.get(cleanFilename).getFileName().toString();
//
//        try {
//            Path targetLocation = this.fileStorageLocation.resolve(finalFilename);
//            file.transferTo(targetLocation.toFile());
//            return finalFilename;
//        } catch (IOException ex) {
//            throw new RuntimeException("Could not store file " + finalFilename + ". Please try again!", ex);
//        }
//    }
//}
