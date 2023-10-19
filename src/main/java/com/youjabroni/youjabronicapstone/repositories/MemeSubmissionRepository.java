package com.youjabroni.youjabronicapstone.repositories;

import com.youjabroni.youjabronicapstone.models.MemeSubmission;
import com.youjabroni.youjabronicapstone.models.Tournament;
import com.youjabroni.youjabronicapstone.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemeSubmissionRepository extends JpaRepository<MemeSubmission, Long> {
    List<MemeSubmission> findAllByUser(User user);
}
