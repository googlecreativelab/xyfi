# Xyfi: BYO pointing device at a physical installation

Xyfi (pronounced ex-Wi-Fi) is an experiment in using BYO devices at a physical installation. People connect their smartphone to the installation and use it as a pointing device to interact with a larger screen.


## Getting started

To try the experiment you need a computer, an Android phone and a Wi-Fi connection. 

Here's how to get Xyfi running after cloning this repo:

1. Run the server:

```bash
npm install
npm start
```

2. Open Chrome on a the computer and go to http://localhost:8080/screen.

3. On the Android phone open mobile chrome and go to <http://<the computer's IP>:8080 (make sure your phone is connected to the same Wi-Fi as the computer).

4. Point at the computer screen and move the circle around at will.


## Compatibility

For the sake of simplicity this example works on Android only. However, Xyfi does work on iOS with [gyroscope normalization](https://www.npmjs.com/package/gyronorm).


## About the experiment

This experiment had three main requirements:
 1. People must use their own smartphones to interact.
 2. Connecting to the physical installation should be quick and easy.
 3. Technologies should be current and accessible to developers here and now.


## How it works

People join an Xyfi physical installation by connecting their smartphone to a typical Wi-Fi SSID. Upon connection a web page pops up with instructions to point at and interact with a larger screen such as a TV or projection.


## Technologies we used

Xyfi is an experiment in technological creativity. It is a collection of common, existing technology components and tools that work together to create something creative and interactive:
 * A MacOS based laptop
 * Javascript, HTML, CSS and JavaScript
 * [Websockets](https://www.w3.org/TR/2011/WD-websockets-20110929)
 * A fairly typical Wi-Fi router capable of running custom firmware
 * [Captive portal technology](https://en.wikipedia.org/wiki/Captive_portal)
 * [The Device Orientation API](https://www.w3.org/TR/orientation-event)
 * A television or projector


## Connecting

Physical installations are generally used by people who are on their feet, and on the move. They may not have time for an arduous connection process. So it was critical that the connecting was quick, easy and familiar. We wanted the magic to happen instantly.

This ruled out many typical connection methods, such as installing a native app, typing cryptic codes into a text box or a typing full URL into a browser. [NFC](https://en.wikipedia.org/wiki/Near_field_communication) was potential, but is not well supported by iOS.

In the end we decided to go with a Wi-Fi router and captive portal technology. Most smartphone users know how to connect to Wi-Fi, so there was plenty of familiarity there. We also loved the perceived sorcery of the captive portal popping up immediately.

The great thing about captive portal technology is that it is supported by all but the very oldest of smartphone/OS combinations. Also, since a captive portal is essentially a web page, we can get the UI done with classic web development technologies.

There are many ways to configure a captive portal. For example, [nodogsplash](https://wiki.openwrt.org/doc/howto/wireless.hotspot.nodogsplash), which works with the custom firmware, [OpenWRT](https://openwrt.org). Or the firmware [DD-WRT](https://www.dd-wrt.com) has [its own set of captive portal solutions](https://www.dd-wrt.com/wiki/index.php/Captive_Portal) as well. 

It is also possible to simulate your own captive portal by directing traffic to a single web page hosted on your local network. This can be accomplished with tools like [dnsmasq](http://www.thekelleys.org.uk/dnsmasq/doc.html) and [iptables](https://en.wikipedia.org/wiki/Iptables).

One caveat: On most mobile operating systems the captive portal application not an actual browser, but rather a browser-like native app with some limitations in features and even stability. For example, the captive portal in iOS can be a little laggy, and can even crash when rendering large complex web applications. So we learned to keep the remote control UI as simple as possible, mostly acting as a pointing mechanism that sends gyroscope information to the server.


## Using the phone as a controller

Once connected to Wi-Fi, the smartphone acts as a controller -- perhaps something along the lines of a simplified Wii Remote. This is accomplished by transferring gyroscope information from the phone via the captive portal to a local web server, and displaying a cursor on a larger screen or projection.

At first we weren’t sure the gyroscope alone would be intuitive. Since it's only aware of the phone’s rotation, lateral or vertical movements have no effect. However, we were surprised at how well it worked. People had no problem making the connection between their phone and the cursor, and moved the cursor around the screen naturally without prompting.

To create this sense of “pointing” we used the browser’s [DeviceOrientation event](https://w3c.github.io/deviceorientation/spec-source-orientation.html), which collects information from the gyroscope.

Using Websockets we relay this information to a server on the local network. The server can use any open source real time server technology, such as Node.js’s [Socket.io](https://socket.io) or [Python’s Tornado](http://www.tornadoweb.org).

As gyroscope information is received in real time the web server relays coordinates to a web browser on a larger screen, which in turn translates the values into screen coordinates for the cursor.


## UX challenges

One of biggest challenge we faced with UX was understanding when people had stopped engaging with the installation. 

We couldn’t rely on Wi-Fi disconnection because typical smartphone users do not generally disconnect from a Wi-Fi network after use. 

Some of our earlier prototypes engaged users with their cursor as soon as the captive portal popped up. But you can imagine what would happen when someone placed the phone in their pocket and obliviously walked away: The cursor would remain on screen moving around erratically until the user was far enough away from the Wi-Fi signal to be disconnected (i.e. two blocks away). Not good.

The solution was to require the user to hold their finger on a “press here” button in order to interact. This way we could use the release of their finger as a clear indicator of disengagement. 

This simple user action had some important additional side effects:
 * The instructions to “point at the center of the screen and hold” acted as a calibration moment. We are essentially telling people to let us know what they consider to be the center of the screen, depending on where they are standing, and the angle of their arm and hand.
 * It made interaction more deliberate for users, who often needed a few seconds to get their bearings.
 * Crucially, the constant interaction with the screen prevented the phones from going into sleep mode and losing connection.

It’s worth noting that we attempted to use the phone’s compass to figure out which direction a person was pointing. But we couldn’t get immediately consistent information out of the compass via a browser. The compass itself often requires calibration and is affected electromagnetic interference. We needed instant engagement, so we opted for the “point and hold” calibration solution. 


## Conclusion

Xyfi is a great example of how a small team of developers can accomplish something magical with relatively simply underlying technology. We hope it inspires other developers and teams to use development tools at hand in creative ways to surprise and delight.

Disclaimer: Xyfi is an experiment, it is not an official Google product.
