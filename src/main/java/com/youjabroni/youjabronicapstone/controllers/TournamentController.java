package com.youjabroni.youjabronicapstone.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.youjabroni.youjabronicapstone.models.*;
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

import java.util.List;
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
    }{}





    //MEME SUBMISSION FOR ROUNDS
    @GetMapping("/{id}/create")
    public String showCreateMemePage(@PathVariable long id, Model model) {
        //will eventually implement specific round num
        Tournament tournament = tournamentDao.findById(1L).get();
        List<Round> tournamentRounds =  tournament.getRounds();
        System.out.println("heres something dude " + tournamentRounds.get(1).getRound_num());
        model.addAttribute("tournament", tournament);
        model.addAttribute("user", userDao.findById(id).get());
        model.addAttribute("meme", new MemeSubmission());
        return "tournament/create-meme";
    }
    @PostMapping("/{id}/create")
    public String saveMemeSubmission(@PathVariable long id, @ModelAttribute MemeSubmission meme){
        User user = userDao.findById(id).get();
        Round round = roundDao.findById(meme.getRound().getId()).orElse(null);
        meme.setUser(user);
        meme.setRound(round);
        memeSubmissionDao.save(meme);
        return "redirect:/vote";
    }






    //Websocket stuff. Sends memeSubmissions as "messages" and updates users in lobby////////////////////////////
    @MessageMapping("/tournament/waiting-room/{tournamentId}/userjoin")
    public void joinMessage(@DestinationVariable Long tournamentId, @Payload Message joinMessage) throws JsonProcessingException{
        System.out.println("----------In sendMessage method for userjoin---------");
        joinMessage.setMessageType(Message.MessageType.JOIN);
        System.out.println(joinMessage);
        messagingTemplate.convertAndSend(format("/secured/tournament/waiting-room/%s", tournamentId), joinMessage);

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
    @MessageMapping("/create/{tournamentId}")
    public void sendSubmission(@DestinationVariable String tournamentId, @Payload MemeSubmission memeSubmission) {
        messagingTemplate.convertAndSend(format("tournament/create-meme/%s", tournamentId), memeSubmission);
    }

    @MessageMapping("/create/{tournamentId}/addUser")
    public void addUser(@DestinationVariable String tournamentId, @Payload MemeSubmission memeSubmission,
                        SimpMessageHeaderAccessor headerAccessor) {
        String currentTournamentId = (String) headerAccessor.getSessionAttributes().put("tournament_id", tournamentId);
        if (tournamentId != null) {
            MemeSubmission leaveSubmission = new MemeSubmission();

            leaveSubmission.setMessageType(MemeSubmission.MessageType.LEAVE);
            leaveSubmission.setUser(memeSubmission.getUser());
            messagingTemplate.convertAndSend(format("/chat-room/%s", currentTournamentId), leaveSubmission);
        }
        headerAccessor.getSessionAttributes().put("name", memeSubmission.getUser());
        messagingTemplate.convertAndSend(format("/chat-room/%s", tournamentId), memeSubmission);
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


    @GetMapping("/waiting-room/{id}")
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
    public String leaveTournamentWaitingRoom(@AuthenticationPrincipal UserDetails userDetails) {
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

    //Mapping to return and update users in tournament primarily for websocket
    @GetMapping("/{tournamentId}/members")
    public @ResponseBody Set<User> getTournamentMembers(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentDao.findById(tournamentId).get();
        return tournament.getUserSet();
    }
    //    @GetMapping("/waiting-room/{id}")
//    public String waitingRoom(Model model, @PathVariable Long id) {
//        Tournament tournament = tournamentDao.findById(id).get();
//        model.addAttribute("tournament", tournament);
//        model.addAttribute("users", tournament.getUserSet());
//        return "tournament/waiting-room";
//    }

}
