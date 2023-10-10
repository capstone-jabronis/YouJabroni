package com.youjabroni.youjabronicapstone.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.youjabroni.youjabronicapstone.models.Tournament;
import com.youjabroni.youjabronicapstone.models.User;
import com.youjabroni.youjabronicapstone.models.Message;
import com.youjabroni.youjabronicapstone.repositories.MemeSubmissionRepository;
import com.youjabroni.youjabronicapstone.repositories.RoundRepository;
import com.youjabroni.youjabronicapstone.repositories.TournamentRepository;
import com.youjabroni.youjabronicapstone.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

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

    //Websocket stuff////////////////////////////
    @MessageMapping("/tournament/lobby/{tournamentId}/userjoin")
    public void joinMessage(@DestinationVariable Long tournamentId, @Payload Message joinMessage) throws JsonProcessingException {
        System.out.println("----------In sendMessage method for userjoin---------");
        joinMessage.setMessageType(Message.MessageType.JOIN);
        System.out.println(joinMessage);
        messagingTemplate.convertAndSend(format("/secured/tournament/lobby/%s", tournamentId), joinMessage);

//        , SimpMessageHeaderAccessor headerAccessor
        //^For constructor
//        String currentTournamentId = (String) headerAccessor.getSessionAttributes().put("tournament_id", tournamentId);
//        if (tournamentId != null) {
//            WebsocketMessage leaveMessage = new WebsocketMessage();
//
//            leaveMessage.setMessageType(WebsocketMessage.MessageType.LEAVE);
////            leaveMessage.setSender(.getUser());
//            messagingTemplate.convertAndSend(format("/secured/tournament/waiting-room/%s", currentTournamentId), leaveMessage);
//        }
////        headerAccessor.getSessionAttributes().put("name", memeSubmission.getUser());
//        messagingTemplate.convertAndSend(format("/secured/tournament/waiting-room/%s", tournamentId), joinMessage);
    }
    @MessageMapping("/tournament/lobby/{tournamentId}/send")
    public void sendMessage(@DestinationVariable Long tournamentId, @Payload Message message) throws JsonProcessingException {
        System.out.println("----------In sendMessage method---------");
        System.out.println(message.getMessageType());
//        message.setMessageType(Message.MessageType.JOIN);
        messagingTemplate.convertAndSend(format("/secured/tournament/lobby/%s", tournamentId), message);
    }
//End websocket stuff/////////////////////////////////


    @GetMapping("/vote")
    public String showVotePage() {
        return "tournament/vote";
    }

    @GetMapping("/complete")
    public String showCompletePage() {
        return "tournament/complete";
    }


    @GetMapping("/lobby/{id}")
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
        model.addAttribute("currentUser", user);
        return "/tournament/lobby";
    }

    @GetMapping("/lobby/leave")
    public String leaveTournamentWaitingRoom(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userDao.findByUsername(userDetails.getUsername());
        Tournament tournament = tournamentDao.findById(user.getTournament().getId()).get();
        Set<User> updateUserSet = tournament.getUserSet();
        updateUserSet.remove(user);
        user.setTournament(null);
        userDao.save(user);
        tournamentDao.save(tournament);
        System.out.println("LEFT TOURNY" + tournamentDao.findById(tournament.getId()).get().getUserSet());
        //Logic to change host or delete tournament if users set is empty
        if (updateUserSet.isEmpty()) {
            System.out.println("----------Tournament empty, deleting");
            tournamentDao.delete(tournament);
        } else {
            System.out.println("changing host to next user");
            User newHost = updateUserSet.iterator().next();
            tournament.setHost(newHost);
            tournamentDao.save(tournament);
        }
        return "redirect:/home";
    }

    //Creating new tournaments
    @GetMapping("/create-tournament")
    public String createTournament(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userDao.findByUsername(userDetails.getUsername());
        System.out.println("Creating tournament host: " + user.getUsername());
        Tournament newTournament = new Tournament();
        newTournament.setHost(user);
        tournamentDao.save(newTournament);
        String id = String.valueOf(newTournament.getId());
        System.out.println("Tournament id: " + id);
        return "redirect:/tournament/lobby/" + id;
    }

    //Mapping to return and update users in tournament primarily for websocket
    @GetMapping("/{tournamentId}/members")
    public @ResponseBody Set<User> getTournamentMembers(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentDao.findById(tournamentId).get();
        return tournament.getUserSet();
    }

    //Mapping to return the current tournament host
    @GetMapping("/{tournamentId}/host")
    public @ResponseBody User getTournamentHost(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentDao.findById(tournamentId).get();
        return tournament.getHost();
    }

}
