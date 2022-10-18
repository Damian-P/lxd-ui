# LXD-UI

Web UI on top of LXD. Make container and VM management easy and accessible. Target small and large scale private clouds.

# Setting up for development

Install lxd

    todo

Install HAProxy

    apt install haproxy

Configure HAProxy with below content in /etc/haproxy/haproxy.cfg

    global
      user haproxy
      group lxd
      daemon

    defaults
      mode  http

    frontend lxd_frontend
      bind *:9000
      mode http
      use_backend lxd_core if { path /1.0 } || { path_beg /1.0/ }
      default_backend lxd_ui

    backend lxd_ui
      mode http
      server yarn_serve_port 0.0.0.0:3000

    backend lxd_core
      server lxd_socket /var/snap/lxd/common/lxd/unix.socket

Restart HAProxy

    sudo service haproxy restart

Start dotrun in the head of this repo

    dotrun

Browse through http://0.0.0.0:9000/ and **avoid** querying port 3000 directly. Requests to the lxd core won't reach HAProxy on the port 3000.