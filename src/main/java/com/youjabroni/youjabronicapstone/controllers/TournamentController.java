package com.youjabroni.youjabronicapstone.controllers;

import com.youjabroni.youjabronicapstone.models.MemeSubmission;
import com.youjabroni.youjabronicapstone.models.Tournament;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.repositories.MemeSubmissionRepository;
import com.youjabroni.youjabronicapstone.repositories.RoundRepository;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static java.lang.String.format;

@Controller
@RequestMapping("/tournament")
public class TournamentController {
    private TournamentRepository tournamentDao;
    private MemeSubmissionRepository memeSubmissionDao;
    private UserRepository userDao;
    private RoundRepository roundDao;

    @Autowired
    private SimpMessageSendingOperations messagingTemplate;

    @Autowired
    public TournamentController(TournamentRepository tournamentDao, UserRepository userDao, MemeSubmissionRepository memeSubmissionDao, RoundRepository roundDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
        this.memeSubmissionDao = memeSubmissionDao;
        this.roundDao = roundDao;
    }

    @GetMapping("/create")
    public String showCreateMemePage(Model model) {

        return "tournament/create-meme";
    }
    @MessageMapping("/create/{tournamentId}")
    public void sendSubmission(@DestinationVariable String tournamentId, @Payload MemeSubmission memeSubmission){
        messagingTemplate.convertAndSend(format("tournament/create-meme/%s", tournamentId), memeSubmission);
    }

    @MessageMapping("/create/{tournamentId}/addUser")
    public void addUser(@DestinationVariable String tournamentId, @Payload MemeSubmission memeSubmission,
                        SimpMessageHeaderAccessor headerAccessor) {
        String currentTournamentId = (String) headerAccessor.getSessionAttributes().put("tournament_id", tournamentId);
        if (tournamentId != null) {
            MemeSubmission leaveSubmisison = new MemeSubmission();

            leaveSubmisison.setMessageType(MemeSubmission.MessageType.LEAVE);
            leaveSubmisison.setUser(memeSubmission.getUser());
            messagingTemplate.convertAndSend(format("/chat-room/%s", currentTournamentId), leaveSubmisison);
        }
        headerAccessor.getSessionAttributes().put("name", memeSubmission.getUser());
        messagingTemplate.convertAndSend(format("/chat-room/%s", tournamentId), memeSubmission);
    }




    @GetMapping("/vote")
    public String showVotePage() {
        return "tournament/vote";
    }

    @GetMapping("/complete")
    public String showCompletePage() {
        return "tournament/complete";
    }

    @PostMapping("/waiting-room/{id}")
    public String joinTournament(@AuthenticationPrincipal UserDetails userDetails, Model model, @PathVariable Long id) {
        User user = userDao.findByUsername(userDetails.getUsername());
        Tournament tournament = tournamentDao.findById(id).get();
        Set<User> updatedUserSet = tournament.getUserSet();
        updatedUserSet.add(user);
        tournament.setUserSet(updatedUserSet);
        user.setTournament(tournament);
        userDao.save(user);
        tournamentDao.save(tournament);
        model.addAttribute("tournament", tournament);
        model.addAttribute("users", tournament.getUserSet());
        System.out.println("userSet of Tourny" + tournamentDao.findById(id).get().getUserSet());
        return "tournament/waiting-room";
    }

    @GetMapping("/waiting-room/leave")
    public String leaveTournamentWaitingRoom(@AuthenticationPrincipal UserDetails userDetails){
        User user = userDao.findByUsername(userDetails.getUsername());
        Tournament tournament = tournamentDao.findById(user.getTournament().getId()).get();
        Set<User> updateUserSet = tournament.getUserSet();
        updateUserSet.remove(user);
        user.setTournament(null);
        userDao.save(user);
        tournamentDao.save(tournament);
        System.out.println("LEFT TOURNY" + tournamentDao.findById(tournament.getId()).get().getUserSet());
        return "redirect:/home";
    }

    //    @GetMapping("/waiting-room/{id}")
//    public String waitingRoom(Model model, @PathVariable Long id) {
//        Tournament tournament = tournamentDao.findById(id).get();
//        model.addAttribute("tournament", tournament);
//        model.addAttribute("users", tournament.getUserSet());
//        return "tournament/waiting-room";
//    }

}
