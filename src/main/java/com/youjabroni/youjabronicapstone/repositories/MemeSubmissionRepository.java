package com.youjabroni.youjabronicapstone.repositories;

import com.youjabroni.youjabronicapstone.models.MemeSubmission;
import com.youjabroni.youjabronicapstone.models.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemeSubmissionRepository extends JpaRepository<MemeSubmission, Long> {
}
