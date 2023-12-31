package com.youjabroni.youjabronicapstone.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.youjabroni.youjabronicapstone.models.*;

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

    public TournamentController(TournamentRepository tournamentDao, UserRepository userDao, MemeSubmissionRepository memeSubmissionDao, RoundRepository roundDao) {
        this.tournamentDao = tournamentDao;
        this.userDao = userDao;
        this.memeSubmissionDao = memeSubmissionDao;
        this.roundDao = roundDao;
    }

    ;

    //MEME SUBMISSION FOR ROUNDS
    @GetMapping("/{id}/create")
    public String showCreateMemePage(@PathVariable long id, Model model) {
        //will eventually implement specific round num
        Tournament tournament = tournamentDao.findById(1L).get();
        List<Round> tournamentRounds = tournament.getRounds();
        System.out.println("heres something dude " + tournamentRounds.get(1).getRound_num());
        model.addAttribute("tournament", tournament);
        model.addAttribute("user", userDao.findById(id).get());
        model.addAttribute("meme", new MemeSubmission());
        return "tournament/create-meme";
    }

    @PostMapping("/{id}/create")
    public String saveMemeSubmission(@PathVariable long id, @ModelAttribute MemeSubmission meme) {
        User user = userDao.findById(id).get();
        Round round = roundDao.findById(meme.getRound().getId()).orElse(null);
        meme.setUser(user);
        meme.setRound(round);
        memeSubmissionDao.save(meme);
        return "redirect:/vote";
    }


    //Websocket stuff////////////////////////////
    @MessageMapping("/tournament/lobby/{tournamentId}/userjoin")
    public void joinMessage(@DestinationVariable Long tournamentId, @Payload Message joinMessage) throws JsonProcessingException {
        System.out.println("----------In sendMessage method for userjoin---------");
        joinMessage.setMessageType(Message.MessageType.JOIN);
        System.out.println(joinMessage);
        messagingTemplate.convertAndSend(format("/secured/tournament/lobby/%s", tournamentId), joinMessage);
    }

    @MessageMapping("/tournament/lobby/{tournamentId}/send")
    public void sendMessage(@DestinationVariable Long tournamentId, @Payload Message message) {
        System.out.println("----------In sendMessage method---------");
        System.out.println(message.getMessageType());
        String messageType = String.valueOf(message.getMessageType());
        //change tournament started status if it isn't already started
        if (messageType.equals("START")) {
            Tournament tournament = tournamentDao.findById(tournamentId).get();
            if (!tournament.getStarted()) {
                tournament.setStarted(true);
                tournamentDao.save(tournament);
            }
        } else if (messageType.equals("LEAVE")) {
            System.out.println("------BACKEND LEAVE MESSAGE-----");
            User user = userDao.findByUsername(message.getUser());
            cleanTournaments(user);
            System.out.println(user.getUsername());
            Tournament tournament = tournamentDao.findById(tournamentId).get();
            Set<User> updateUserSet = tournament.getUserSet();
            updateUserSet.remove(user);
            user.setTournament(null);
            userDao.save(user);
            tournamentDao.save(tournament);
            Set<User> currentUserSet = tournamentDao.findById(tournament.getId()).get().getUserSet();
            //Logic to change host or delete tournament if users set is empty, will keep the tournament if there is a winner
            try {
                Thread.sleep(3000);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
            }
            if (currentUserSet.isEmpty() && tournamentDao.findById(tournamentId).get().getWinner() == null) {
                System.out.println("----------Tournament empty, deleting");
                tournamentDao.delete(tournament);
            } else if (!tournament.getStarted()) {
                System.out.println("changing host to next user");
                User newHost = currentUserSet.iterator().next();
                tournament.setHost(newHost);
                tournamentDao.save(tournament);
            }
        } else if (messageType.equals("TIE")) {
            int num = (int) Math.floor(Math.random() * 100);
            if (num % 2 == 0) {
                message.setText("3");
            } else {
                message.setText("4");
            }
        }
        messagingTemplate.convertAndSend(format("/secured/tournament/lobby/%s", tournamentId), message);
    }

    @MessageMapping("/tournament/lobby/{tournamentId}/finish")
    public void finishMessage(@DestinationVariable Long tournamentId, @Payload Message message) throws JsonProcessingException {
        System.out.println("----------In FINISH method---------");
        System.out.println(message.getMessageType());
        System.out.println(message.getUser());
        //Set winner in tournament
        User winner = userDao.findByUsername(message.getUser());
        Tournament tournament = tournamentDao.findById(tournamentId).get();
//        tournament.setStarted(false);
        tournament.setWinner(winner);
        tournamentDao.save(tournament);
        messagingTemplate.convertAndSend(format("/secured/tournament/lobby/%s", tournamentId), message);
    }

    @MessageMapping("/tournament/lobby/{tournamentId}/meme")
    public void memeMapping(@DestinationVariable Long tournamentId, @Payload Message message) throws JsonProcessingException {
        try {
            System.out.println("----------In Meme Method---------");
            MemeSubmission submittedMeme = new MemeSubmission();
            User user = userDao.findByUsername(message.getUser());
            String text = message.getText();
            submittedMeme.setCaption(text);
            submittedMeme.setMemeURL(message.getMemeURL());
            memeSubmissionDao.save(submittedMeme);
            System.out.println("creating empty list");
            List<MemeSubmission> submissions = memeSubmissionDao.findAllByUser(user);
            submissions.add(submittedMeme);
            userDao.save(user);
            submittedMeme.setUser(user);
            memeSubmissionDao.save(submittedMeme);
            System.out.println("---save the meme in the memeSubmission table---");
//            userDao.save(user);
            System.out.println("----save the user----");

            //sending meme info back to front end


            System.out.println("----Attempting to send meme back to frontend----");
//            messagingTemplate.convertAndSend(format("/secured/tournament/lobby/%s", tournamentId), submittedMeme);
            System.out.println("----Attempting to send message back to front end----");
            messagingTemplate.convertAndSend(format("/secured/tournament/lobby/%s", tournamentId), message);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            System.out.println("ERROR IN MEME MESSAGE MAPPING");
        }
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
        //Remove user from old tournaments first
        cleanTournaments(user);
        if (tournamentDao.existsById(id)) {
            Tournament tournament = tournamentDao.findById(id).get();
            Set<User> updatedUserSet = tournament.getUserSet();
            if (updatedUserSet.size() != tournament.getPlayerCount()) {
                updatedUserSet.add(user);
                tournament.setUserSet(updatedUserSet);
                user.setTournament(tournament);
                userDao.save(user);
                tournamentDao.save(tournament);
                model.addAttribute("tournament", tournament);
                model.addAttribute("users", tournament.getUserSet());
                model.addAttribute("currentUser", user);
                return "tournament/lobby";
            } else {
                return "redirect:/home";
            }
        } else {
            return "redirect:/home";
        }
    }

    //Creating new tournaments
    @GetMapping("/create-tournament")
    public String createTournament(@AuthenticationPrincipal UserDetails userDetails, @RequestParam("player-count") String playerCount) {
        User user = userDao.findByUsername(userDetails.getUsername());
        cleanTournaments(user);
        int count = Integer.parseInt(playerCount);
        System.out.println("Creating tournament host: " + user.getUsername());
        Tournament newTournament = new Tournament();
        newTournament.setHost(user);
        newTournament.setPlayerCount(count);
        newTournament.setStarted(false);
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

    @GetMapping("/{tournamentId}/getWinner")
    public @ResponseBody User getWinner(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentDao.findById(tournamentId).get();
        return tournament.getWinner();
    }

    @GetMapping("/{tournamentId}/players")
    public @ResponseBody int getPlayerAmount(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentDao.findById(tournamentId).get();
        return tournament.getPlayerCount();
    }

    public void cleanTournaments(User user) {
        //Needs more work, but cleans up ok
        System.out.println("----CLEANING TOURNAMENTS");
        user.setTournament(null);
        userDao.save(user);
        List<Tournament> tournamentList = tournamentDao.findAll();
        for (int i = 0; i < tournamentList.size(); i++) {
            Tournament tournament = tournamentList.get(i);
            Long id = tournament.getId();
            Set<User> tournamentMembers = tournament.getUserSet();
            if (tournamentMembers.contains(user)) {
                System.out.println("----------REMOVING USER FROM:-----------");
                System.out.println(tournament.getId());
                tournament.getUserSet().remove(user);
                tournamentDao.save(tournament);
                //Deletes tournaments that do not have a winner, so the home feed doesn't end up with a bunch of broken tournaments
                Tournament updatedTournament = tournamentDao.findById(id).get();
                User currentHost = updatedTournament.getHost();
                if (updatedTournament.getUserSet().size() > 0) {
                    //set new host of there are other users in the tournament(s)
                    if (currentHost.getId() == user.getId()) {
                        System.out.println("----SETTING NEW HOST----");
                        User newHost = updatedTournament.getUserSet().iterator().next();
                        updatedTournament.setHost(newHost);
                        tournamentDao.save(updatedTournament);
                    }
                    //send a message to update the tournament for the remaining users need to figure out how to do this, it don't send anything. Need to have a websocket connection first
//                    Message message = new Message();
//                    message.setMessageType(Message.MessageType.JOIN);
//                    message.setText("User has left the game");
//                    message.setUser(user.getUsername());
//                    System.out.println("SENDING MESSAGE");
//                    System.out.println(message.getText());
//                    messagingTemplate.convertAndSend(format("/tournament/lobby/%s/userjoin", id), message);
                }
                if (updatedTournament.getUserSet().isEmpty() && updatedTournament.getWinner() == null) {
                    System.out.println("---DELETING TOURNAMENT-----");
                    System.out.println(updatedTournament.getId());
                    updatedTournament.setHost(null);
                    tournamentDao.save(updatedTournament);
                    tournamentDao.delete(updatedTournament);
                }
            }
        }
    }
}
