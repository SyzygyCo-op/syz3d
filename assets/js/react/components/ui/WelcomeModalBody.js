import * as React from "react";
import { Typography } from "antd";

const { Text, Paragraph } = Typography;

export const WelcomeModalBody = () => {
  return (
    <>
      <Paragraph>Hi!</Paragraph>
      <Paragraph>
        This isn't a finished game. There is something here, however, if nothing
        more than the story of where it came from and where it might go.
      </Paragraph>
      <Paragraph>
        Going to break from form a bit and give my own thoughts behind this
        "art," if we want to call it that. Ever since playing Super Mario World
        on the SNES in early 90's I've wanted to make a platformer-style game. I
        sensed magic as I watched the protagonist run, jump and fight its way
        through virtual worlds populated with a finite set of elements following
        simple rules which combine to create novel challenges. It was like
        watching a cartoon that could be different every time.
      </Paragraph>
      <Paragraph>
        The Covid pandemic was a time of tragedies great and small, but also a
        time of self-rediscovery for a lot of poeple, including me. That's when
        I decided to sit down and do this thing. I didn't know exactly what I
        was making at first. The desire to make a platformer was present, but I
        was also feeling the isolation of the lockdown, so I also wanted
        something that would facilitate virtually hanging out with people. Hence
        everyone who comes to this site can see each other and explore a shared
        environment.
      </Paragraph>
      <Paragraph>
        How does all this related to "glitch" (besides the{" "}
        <Text strong>totally</Text> intentional bugs /s)? When I combined the
        concept of a platformer with "glitch" I, for some reason, thought of
        these anecdotes about squirrels (unknowingly?) causing major havoc with
        electrical grids by nesting around and chewing on wires. Maybe the
        reason I went there had to do with the recent intense fire seasons in
        California, which got me thinking about how the natural world beyond
        civilization has perhaps been pushed to a breaking point by wasteful
        human exploitation and is starting to fight back, seeking equilibrium.
        It feels like part of the present zeitgeist to me, so I wanted to give
        it expression somehow.
      </Paragraph>
      <Paragraph>
        In the finished version of this game I envision players controlling
        squirrels, facing man-made challenges, attempting to find a missing
        squirrel-pup. The challenges scale up or down according to the number of
        concurrent players. After some investigation it's revealed that the pup
        has hitched a ride on a drone and the players must travel from the edge
        of the suburbs to the heart of the city to save him!
      </Paragraph>
      <Paragraph>
        By the way, all the code is on{" "}
        <a href="https://github.com/SyzygyCo-op/syz3d">Github</a> if you're in
        to that sort of thing.
      </Paragraph>
      <Paragraph>
        Follow <a href="https://twitter.com/skwerelz">@skwerelz</a> on Twitter for updates.
      </Paragraph>
    </>
  );
};
