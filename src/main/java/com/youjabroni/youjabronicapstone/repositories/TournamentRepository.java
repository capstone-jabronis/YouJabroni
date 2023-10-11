package com.youjabroni.youjabronicapstone.repositories;

import com.youjabroni.youjabronicapstone.models.Round;
import com.youjabroni.youjabronicapstone.models.Tournament;
import com.youjabroni.youjabronicapstone.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TournamentRepository extends JpaRepository<Tournament, Long> {

    List<Tournament> findByWinnerId(long id);

}
